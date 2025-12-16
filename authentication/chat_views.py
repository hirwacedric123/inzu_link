"""
Chat Views for KoraQuest.

This module contains views for the real-time chat functionality
between buyers and sellers.
"""

import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Max, Count
from django.utils import timezone
from django.core.paginator import Paginator
from django.conf import settings

from .models import Conversation, Message, User, Post, PropertyInquiry


@login_required
def chat_list(request):
    """
    Display list of all conversations for the current user.
    Shows both buyer and seller conversations.
    """
    user = request.user
    
    # Get all conversations where user is either buyer or seller
    conversations = Conversation.objects.filter(
        Q(buyer=user) | Q(seller=user),
        status='active'
    ).select_related(
        'buyer', 'seller', 'property'
    ).prefetch_related(
        'messages'
    ).order_by('-last_message_at', '-created_at')
    
    # Add unread counts and last message to each conversation
    conversations_with_data = []
    total_unread = 0
    
    for conv in conversations:
        unread_count = conv.get_unread_count(user)
        total_unread += unread_count
        last_message = conv.get_last_message()
        other_user = conv.get_other_participant(user)
        
        conversations_with_data.append({
            'conversation': conv,
            'unread_count': unread_count,
            'last_message': last_message,
            'other_user': other_user,
        })
    
    context = {
        'conversations': conversations_with_data,
        'total_unread': total_unread,
    }
    
    return render(request, 'authentication/chat_list.html', context)


@login_required
def chat_room(request, conversation_id):
    """
    Display individual chat room for a conversation.
    Handles WebSocket connection for real-time messaging.
    """
    user = request.user
    
    # Get conversation and verify access
    conversation = get_object_or_404(
        Conversation.objects.select_related('buyer', 'seller', 'property', 'inquiry'),
        Q(buyer=user) | Q(seller=user),
        id=conversation_id,
        status='active'
    )
    
    # Mark messages as read
    conversation.mark_as_read(user)
    
    # Get messages (paginated, most recent first for initial load)
    messages_per_page = getattr(settings, 'CHAT_MESSAGES_PER_PAGE', 50)
    messages = conversation.messages.filter(
        is_deleted=False
    ).select_related('sender').order_by('-created_at')[:messages_per_page]
    
    # Reverse for display (oldest first)
    messages = list(reversed(messages))
    
    # Get other participant info
    other_user = conversation.get_other_participant(user)
    
    # Determine WebSocket URL
    # PythonAnywhere requires wss:// for secure connections
    host = request.get_host()
    is_pythonanywhere = '.pythonanywhere.com' in host
    
    if request.is_secure() or is_pythonanywhere:
        ws_scheme = 'wss'
    else:
        ws_scheme = 'ws'
    
    # For PythonAnywhere, ensure we use the correct host
    if is_pythonanywhere and not host.startswith('http'):
        # PythonAnywhere WebSocket proxy
        ws_url = f"{ws_scheme}://{host}/ws/chat/{conversation.id}/"
    else:
        ws_url = f"{ws_scheme}://{host}/ws/chat/{conversation.id}/"
    
    context = {
        'conversation': conversation,
        'messages': messages,
        'other_user': other_user,
        'current_user': user,
        'ws_url': ws_url,
        'property': conversation.property,
    }
    
    return render(request, 'authentication/chat_room.html', context)


@login_required
def start_conversation(request, property_id=None, user_id=None):
    """
    Start a new conversation or redirect to existing one.
    Can be triggered from a property listing or directly with a user.
    """
    user = request.user
    
    if property_id:
        # Starting conversation about a property
        property_obj = get_object_or_404(Post, id=property_id)
        seller = property_obj.user
        
        # Can't start conversation with yourself
        if seller == user:
            return JsonResponse({
                'success': False,
                'error': 'You cannot start a conversation with yourself'
            }, status=400)
        
        # Check if conversation already exists
        existing = Conversation.objects.filter(
            buyer=user,
            seller=seller,
            property=property_obj,
            status='active'
        ).first()
        
        if existing:
            # Redirect to existing conversation
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'conversation_id': existing.id,
                    'redirect_url': f'/chat/{existing.id}/'
                })
            return redirect('chat_room', conversation_id=existing.id)
        
        # Create new conversation
        conversation = Conversation.objects.create(
            buyer=user,
            seller=seller,
            property=property_obj
        )
        
    elif user_id:
        # Starting direct conversation with a user
        other_user = get_object_or_404(User, id=user_id)
        
        if other_user == user:
            return JsonResponse({
                'success': False,
                'error': 'You cannot start a conversation with yourself'
            }, status=400)
        
        # Check for existing conversation (either direction)
        existing = Conversation.objects.filter(
            Q(buyer=user, seller=other_user) | Q(buyer=other_user, seller=user),
            property__isnull=True,
            status='active'
        ).first()
        
        if existing:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'conversation_id': existing.id,
                    'redirect_url': f'/chat/{existing.id}/'
                })
            return redirect('chat_room', conversation_id=existing.id)
        
        # Determine buyer/seller (buyer initiates)
        conversation = Conversation.objects.create(
            buyer=user,
            seller=other_user
        )
    else:
        return JsonResponse({
            'success': False,
            'error': 'Property ID or User ID required'
        }, status=400)
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'conversation_id': conversation.id,
            'redirect_url': f'/chat/{conversation.id}/'
        })
    
    return redirect('chat_room', conversation_id=conversation.id)


@login_required
def start_conversation_from_inquiry(request, inquiry_id):
    """
    Start or continue a conversation from a property inquiry.
    Links the conversation to the inquiry for context.
    """
    user = request.user
    inquiry = get_object_or_404(PropertyInquiry, inquiry_id=inquiry_id)
    
    # Verify user is part of this inquiry
    if inquiry.buyer != user and inquiry.property.user != user:
        return JsonResponse({
            'success': False,
            'error': 'You do not have access to this inquiry'
        }, status=403)
    
    # Check if conversation already exists for this inquiry
    existing = Conversation.objects.filter(
        inquiry=inquiry,
        status='active'
    ).first()
    
    if existing:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'conversation_id': existing.id,
                'redirect_url': f'/chat/{existing.id}/'
            })
        return redirect('chat_room', conversation_id=existing.id)
    
    # Create new conversation linked to inquiry
    conversation = Conversation.objects.create(
        buyer=inquiry.buyer,
        seller=inquiry.property.user,
        property=inquiry.property,
        inquiry=inquiry
    )
    
    # Create initial system message with inquiry context
    Message.objects.create(
        conversation=conversation,
        sender=inquiry.buyer,
        content=f"📋 Inquiry Reference: {inquiry.inquiry_id}\n\n{inquiry.message}"
    )
    conversation.last_message_at = timezone.now()
    conversation.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'conversation_id': conversation.id,
            'redirect_url': f'/chat/{conversation.id}/'
        })
    
    return redirect('chat_room', conversation_id=conversation.id)


# ==============================================
# API Endpoints
# ==============================================

@login_required
@require_http_methods(['GET'])
def api_get_messages(request, conversation_id):
    """
    API endpoint to get messages for a conversation.
    Supports pagination with 'before' parameter for loading older messages.
    """
    user = request.user
    
    # Verify conversation access
    conversation = get_object_or_404(
        Conversation,
        Q(buyer=user) | Q(seller=user),
        id=conversation_id
    )
    
    # Get pagination params
    before_id = request.GET.get('before')
    limit = min(int(request.GET.get('limit', 50)), 100)
    
    # Build query
    messages_qs = conversation.messages.filter(is_deleted=False).select_related('sender')
    
    if before_id:
        messages_qs = messages_qs.filter(id__lt=before_id)
    
    messages = messages_qs.order_by('-created_at')[:limit]
    
    # Format messages for JSON response
    messages_data = []
    for msg in reversed(list(messages)):
        messages_data.append({
            'id': msg.id,
            'content': msg.get_display_content(),
            'sender_id': msg.sender.id,
            'sender_name': msg.sender.get_full_name() or msg.sender.username,
            'sender_avatar': msg.sender.profile_picture.url if msg.sender.profile_picture else None,
            'is_mine': msg.sender == user,
            'is_read': msg.is_read,
            'timestamp': msg.created_at.isoformat(),
            'has_attachment': bool(msg.attachment),
            'attachment_url': msg.attachment.url if msg.attachment else None,
            'attachment_type': msg.attachment_type,
        })
    
    # Reverse again to show oldest first (for display)
    messages_data = list(reversed(messages_data))
    
    return JsonResponse({
        'success': True,
        'messages': messages_data,
        'has_more': len(messages) == limit,
        'conversation_id': conversation.id
    })


@login_required
@require_http_methods(['POST'])
def api_send_message(request, conversation_id):
    """
    API endpoint to send a message (fallback for non-WebSocket).
    WebSocket is preferred for real-time messaging.
    """
    user = request.user
    
    # Verify conversation access
    conversation = get_object_or_404(
        Conversation,
        Q(buyer=user) | Q(seller=user),
        id=conversation_id,
        status='active'
    )
    
    # Parse request data
    try:
        data = json.loads(request.body)
        content = data.get('message', '').strip()
    except json.JSONDecodeError:
        content = request.POST.get('message', '').strip()
    
    if not content:
        return JsonResponse({
            'success': False,
            'error': 'Message content is required'
        }, status=400)
    
    # Validate message length
    max_length = getattr(settings, 'CHAT_MESSAGE_MAX_LENGTH', 2000)
    if len(content) > max_length:
        content = content[:max_length]
    
    # Create message
    message = Message.objects.create(
        conversation=conversation,
        sender=user,
        content=content
    )
    
    # Update conversation timestamp
    conversation.last_message_at = timezone.now()
    conversation.save(update_fields=['last_message_at'])
    
    return JsonResponse({
        'success': True,
        'message': {
            'id': message.id,
            'content': message.content,
            'sender_id': user.id,
            'sender_name': user.get_full_name() or user.username,
            'timestamp': message.created_at.isoformat(),
            'is_read': False,
        }
    })


@login_required
@require_http_methods(['POST'])
def api_mark_read(request, conversation_id):
    """
    API endpoint to mark all messages in a conversation as read.
    """
    user = request.user
    
    conversation = get_object_or_404(
        Conversation,
        Q(buyer=user) | Q(seller=user),
        id=conversation_id
    )
    
    conversation.mark_as_read(user)
    
    return JsonResponse({
        'success': True,
        'message': 'Messages marked as read'
    })


@login_required
@require_http_methods(['GET'])
def api_unread_count(request):
    """
    API endpoint to get total unread message count for the current user.
    Useful for updating notification badges.
    """
    user = request.user
    
    # Get all active conversations
    conversations = Conversation.objects.filter(
        Q(buyer=user) | Q(seller=user),
        status='active'
    )
    
    total_unread = 0
    unread_by_conversation = {}
    
    for conv in conversations:
        count = conv.get_unread_count(user)
        if count > 0:
            total_unread += count
            unread_by_conversation[conv.id] = count
    
    return JsonResponse({
        'success': True,
        'total_unread': total_unread,
        'by_conversation': unread_by_conversation
    })


@login_required
@require_http_methods(['GET'])
def api_conversations(request):
    """
    API endpoint to get list of conversations for the current user.
    """
    user = request.user
    
    conversations = Conversation.objects.filter(
        Q(buyer=user) | Q(seller=user),
        status='active'
    ).select_related(
        'buyer', 'seller', 'property'
    ).order_by('-last_message_at', '-created_at')
    
    conversations_data = []
    for conv in conversations:
        other_user = conv.get_other_participant(user)
        last_message = conv.get_last_message()
        
        conversations_data.append({
            'id': conv.id,
            'conversation_id': conv.conversation_id,
            'other_user': {
                'id': other_user.id,
                'username': other_user.username,
                'full_name': other_user.get_full_name() or other_user.username,
                'avatar': other_user.profile_picture.url if other_user.profile_picture else None,
            },
            'property': {
                'id': conv.property.id,
                'title': conv.property.title,
                'image': conv.property.image.url if conv.property and conv.property.image else None,
            } if conv.property else None,
            'unread_count': conv.get_unread_count(user),
            'last_message': {
                'content': last_message.get_display_content()[:100] if last_message else None,
                'timestamp': last_message.created_at.isoformat() if last_message else None,
                'is_mine': last_message.sender == user if last_message else False,
            } if last_message else None,
            'created_at': conv.created_at.isoformat(),
        })
    
    return JsonResponse({
        'success': True,
        'conversations': conversations_data
    })


@login_required
@require_http_methods(['POST'])
def api_archive_conversation(request, conversation_id):
    """
    API endpoint to archive a conversation.
    """
    user = request.user
    
    conversation = get_object_or_404(
        Conversation,
        Q(buyer=user) | Q(seller=user),
        id=conversation_id
    )
    
    conversation.status = 'archived'
    conversation.save(update_fields=['status'])
    
    return JsonResponse({
        'success': True,
        'message': 'Conversation archived'
    })

