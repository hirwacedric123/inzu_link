# 🚀 Quick Start Guide

## Starting the Server

### For Chat/WebSocket Support (RECOMMENDED):
```bash
./start_chat_server.sh
```
This uses **Daphne** and supports WebSocket chat functionality.

### For Regular Django (NO Chat):
```bash
./runserver.sh
```
This uses regular `runserver` - **chat will NOT work**.

## Manual Commands

### With WebSocket Support:
```bash
source cedenv/bin/activate
./cedenv/bin/daphne -b 0.0.0.0 -p 8000 InzuLink.asgi:application
```

### Without WebSocket:
```bash
source cedenv/bin/activate
./cedenv/bin/python manage.py runserver 0.0.0.0:8000
```

## Important Notes

- ⚠️ **Chat requires Daphne** - regular `runserver` won't work for WebSockets
- ✅ Use `./start_chat_server.sh` for full functionality
- 🔧 If `python` command not found, use `./cedenv/bin/python` directly
