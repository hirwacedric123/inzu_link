"""
WebSocket URL routing for Django Channels.

This file defines the WebSocket URL patterns for the chat functionality.
"""

from django.urls import re_path
from authentication import consumers

websocket_urlpatterns = [
    # Chat room WebSocket connection
    # URL pattern: ws://server/ws/chat/<conversation_id>/
    # conversation_id can be integer or UUID string
    re_path(r'ws/chat/(?P<conversation_id>[0-9]+)/$', consumers.ChatConsumer.as_asgi()),
]

