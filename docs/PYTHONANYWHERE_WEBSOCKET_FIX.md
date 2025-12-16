# PythonAnywhere WebSocket Fix

## Problem

PythonAnywhere **does not support WebSocket connections**. This is a platform limitation, not a bug in your code. When trying to connect to WebSocket on PythonAnywhere, you'll see errors like:

```
WebSocket connection to 'wss://inzulink.pythonanywhere.com/ws/chat/2/' failed: 400 Bad Request
```

## Solution

We've implemented an **automatic fallback mechanism** that:

1. **First tries WebSocket** (for platforms that support it)
2. **Automatically falls back to HTTP polling** if WebSocket fails (for PythonAnywhere)

The chat will work on PythonAnywhere using HTTP polling instead of WebSocket. Messages are polled every 2 seconds.

## Changes Made

### 1. Updated `chat_views.py`
- Improved WebSocket URL generation for PythonAnywhere
- Detects PythonAnywhere domains and uses `wss://` for secure connections

### 2. Updated `asgi.py`
- Enhanced ASGI configuration to better handle PythonAnywhere WebSocket proxy

### 3. Updated `chat.js`
- Added automatic WebSocket detection and fallback
- Implemented HTTP polling as fallback mechanism
- Messages are fetched every 2 seconds when using polling mode
- Seamless transition - users won't notice the difference

## How It Works

1. **On Page Load**: The chat tries to connect via WebSocket
2. **If WebSocket Fails** (within 5 seconds):
   - Automatically switches to HTTP polling mode
   - Status shows "Connected (Polling)"
   - Messages are fetched every 2 seconds via HTTP API
3. **Sending Messages**: 
   - Uses WebSocket if available
   - Falls back to HTTP POST if using polling

## User Experience

- **On platforms with WebSocket support**: Real-time messaging (instant)
- **On PythonAnywhere**: Near real-time messaging (2-second delay)
- **No user action required**: Everything happens automatically

## Testing

To test the fallback:

1. Open browser console
2. Navigate to a chat room
3. You should see:
   - "WebSocket not supported, using HTTP polling fallback" (on PythonAnywhere)
   - "WebSocket connected" (on platforms that support it)

## Alternative Solutions

If you need true real-time WebSocket support, consider migrating to:

- **Render.com** (supports WebSocket)
- **Heroku** (supports WebSocket)
- **DigitalOcean App Platform** (supports WebSocket)
- **AWS Elastic Beanstalk** (supports WebSocket)
- **Railway** (supports WebSocket)

## Notes

- The polling interval is set to 2 seconds (configurable in `chat.js`)
- Polling uses the existing `/api/chat/<id>/messages/` endpoint
- No changes needed to your PythonAnywhere configuration
- The fallback is automatic and transparent to users

