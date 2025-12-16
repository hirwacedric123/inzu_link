"""
ASGI config for InzuLink project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/

Updated to support Django Channels for WebSocket chat functionality.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InzuLink.settings')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.conf import settings

# Import WebSocket URL patterns
from InzuLink.routing import websocket_urlpatterns

# Determine if we should use AllowedHostsOriginValidator
# For PythonAnywhere, we need to be more permissive
use_origin_validator = True
if hasattr(settings, 'ALLOWED_HOSTS'):
    # Check if we're on PythonAnywhere
    is_pythonanywhere = any('.pythonanywhere.com' in host for host in settings.ALLOWED_HOSTS)
    # PythonAnywhere WebSocket proxy may have origin validation issues
    # We'll still use it but it should work with proper ALLOWED_HOSTS configuration

# Build WebSocket middleware stack
websocket_stack = AuthMiddlewareStack(
    URLRouter(
        websocket_urlpatterns
    )
)

# Apply origin validator (it should work with proper ALLOWED_HOSTS)
websocket_stack = AllowedHostsOriginValidator(websocket_stack)

application = ProtocolTypeRouter({
    # HTTP requests are handled by Django's ASGI application
    "http": django_asgi_app,
    
    # WebSocket connections are handled by Channels
    "websocket": websocket_stack,
})
