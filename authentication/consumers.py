"""
WebSocket Consumers for KoraQuest Chat.

This module contains the WebSocket consumers that handle real-time
chat communication between buyers and sellers.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time chat messages.
    
    This consumer handles:
    - Connection/disconnection to chat rooms
    - Sending and receiving messages
    - Typing indicators
    - Read receipts
    """
    
    async def connect(self):
        """
        Called when a WebSocket connection is opened.
        Adds the user to the conversation's channel group.
        """
        # Get conversation ID from URL route
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        
        # Get the user from the scope (set by AuthMiddlewareStack)
        self.user = self.scope.get('user')
        
        # Reject connection if user is not authenticated
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        # Verify user has access to this conversation
        has_access = await self.verify_conversation_access()
        if not has_access:
            await self.close()
            return
        
        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Accept the WebSocket connection
        await self.accept()
        
        # Notify others that user has joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_join',
                'user_id': self.user.id,
                'username': self.user.username,
            }
        )
    
    async def disconnect(self, close_code):
        """
        Called when a WebSocket connection is closed.
        Removes the user from the conversation's channel group.
        """
        # Notify others that user has left
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user_id': self.user.id,
                    'username': self.user.username,
                }
            )
            
            # Leave the room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """
        Called when a message is received from the WebSocket.
        Handles different message types: chat messages, typing indicators, read receipts.
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'chat_message')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            elif message_type == 'typing':
                await self.handle_typing(data)
            elif message_type == 'read_receipt':
                await self.handle_read_receipt(data)
            elif message_type == 'ping':
                # Respond to ping for connection keep-alive
                await self.send(text_data=json.dumps({'type': 'pong'}))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def handle_chat_message(self, data):
        """Handle incoming chat messages."""
        message_content = data.get('message', '').strip()
        
        if not message_content:
            return
        
        # Truncate message if too long
        from django.conf import settings
        max_length = getattr(settings, 'CHAT_MESSAGE_MAX_LENGTH', 2000)
        if len(message_content) > max_length:
            message_content = message_content[:max_length]
        
        # Save message to database
        message_data = await self.save_message(message_content)
        
        if message_data:
            # Broadcast message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_data
                }
            )
    
    async def handle_typing(self, data):
        """Handle typing indicator."""
        is_typing = data.get('is_typing', False)
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'username': self.user.username,
                'is_typing': is_typing,
            }
        )
    
    async def handle_read_receipt(self, data):
        """Handle read receipt for messages."""
        message_id = data.get('message_id')
        
        if message_id:
            # Mark message as read in database
            await self.mark_message_read(message_id)
            
            # Notify the sender
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'message_read',
                    'message_id': message_id,
                    'read_by': self.user.id,
                }
            )
    
    # ==========================================
    # Channel layer message handlers
    # ==========================================
    
    async def chat_message(self, event):
        """Send chat message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))
    
    async def typing_indicator(self, event):
        """Send typing indicator to WebSocket."""
        # Don't send typing indicator to the user who is typing
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing'],
            }))
    
    async def message_read(self, event):
        """Send read receipt to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'read_receipt',
            'message_id': event['message_id'],
            'read_by': event['read_by'],
        }))
    
    async def user_join(self, event):
        """Notify that a user has joined."""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_join',
                'user_id': event['user_id'],
                'username': event['username'],
            }))
    
    async def user_leave(self, event):
        """Notify that a user has left."""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_leave',
                'user_id': event['user_id'],
                'username': event['username'],
            }))
    
    # ==========================================
    # Database operations (async)
    # ==========================================
    
    @database_sync_to_async
    def verify_conversation_access(self):
        """
        Verify that the current user has access to this conversation.
        Returns True if user is a participant, False otherwise.
        """
        from authentication.models import Conversation
        
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            return conversation.buyer == self.user or conversation.seller == self.user
        except Conversation.DoesNotExist:
            return False
    
    @database_sync_to_async
    def save_message(self, content):
        """
        Save a message to the database.
        Returns message data dictionary.
        """
        from authentication.models import Conversation, Message
        
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            
            message = Message.objects.create(
                conversation=conversation,
                sender=self.user,
                content=content
            )
            
            # Update conversation's last message timestamp
            conversation.last_message_at = timezone.now()
            conversation.save(update_fields=['last_message_at'])
            
            return {
                'id': message.id,
                'content': message.content,
                'sender_id': message.sender.id,
                'sender_name': message.sender.get_full_name() or message.sender.username,
                'sender_avatar': message.sender.profile_picture.url if message.sender.profile_picture else None,
                'timestamp': message.created_at.isoformat(),
                'is_read': message.is_read,
            }
        except Exception as e:
            print(f"Error saving message: {e}")
            return None
    
    @database_sync_to_async
    def mark_message_read(self, message_id):
        """Mark a message as read."""
        from authentication.models import Message
        
        try:
            message = Message.objects.get(id=message_id)
            # Only mark as read if the user is not the sender
            if message.sender != self.user and not message.is_read:
                message.is_read = True
                message.read_at = timezone.now()
                message.save(update_fields=['is_read', 'read_at'])
                return True
        except Message.DoesNotExist:
            pass
        return False

