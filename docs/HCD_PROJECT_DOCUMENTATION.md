# KoraQuest/InzuLink - Human-Centered Design Project Documentation

## Overview

**KoraQuest** (also known as **InzuLink**) is a human-centered design (HCD) project that prioritizes accessibility, usability, and inclusive design principles. This documentation provides a comprehensive overview of the technologies, interactive features, tools, backend architecture, and frontend-backend integration used in the implementation.

**Project Type**: Real Estate & Furniture Marketplace Platform  
**Live URL**: https://inzulink.bonasolutions.tech  
**Status**: Production-Ready

---

## 1. Technologies Used

### 1.1 Backend Technologies

#### Core Framework
- **Django 5.1.4** - High-level Python web framework
  - Model-View-Template (MVT) architecture
  - Built-in admin interface
  - ORM for database abstraction
  - Security features (CSRF, XSS protection, SQL injection prevention)

#### API Development
- **Django REST Framework 3.15.2** - RESTful API toolkit
  - Serializers for data transformation
  - ViewSets for CRUD operations
  - Browsable API interface
  - Session-based authentication
  - Pagination and filtering support

#### Real-Time Communication
- **Django Channels 4.0.0** - WebSocket support
  - Real-time chat functionality
  - Bidirectional communication
  - Channel layers for message broadcasting
- **Daphne 4.1.0** - ASGI server for WebSocket support
- **channels-redis 4.2.0** - Redis channel layer backend

#### Database
- **SQLite** - Development database (lightweight, file-based)
- **PostgreSQL** - Production database (via psycopg2-binary 2.9.10)
- **dj-database-url 2.2.0** - Database URL configuration

#### Production Server
- **Gunicorn 23.0.0** - WSGI HTTP server for production
- **WhiteNoise 6.8.2** - Static file serving middleware

#### Additional Libraries
- **Pillow 11.0.0** - Image processing and manipulation
- **qrcode 8.0** - QR code generation
- **PyJWT 2.10.1** - JSON Web Token implementation
- **ReportLab 4.2.5** - PDF generation for reports
- **paypack-py** - Payment gateway integration (Mobile Money)
- **python-decouple 3.8** - Environment variable management
- **django-filter 24.3** - Advanced filtering for APIs
- **django-cors-headers 4.6.0** - Cross-Origin Resource Sharing support

### 1.2 Frontend Technologies

#### Core Technologies
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with:
  - Flexbox and Grid layouts
  - CSS animations and transitions
  - Custom properties (CSS variables)
  - Media queries for responsiveness
- **JavaScript (Vanilla)** - No framework dependencies
  - ES6+ features
  - Web Speech API for voice commands
  - Intersection Observer API for scroll animations
  - Fetch API for AJAX requests
  - WebSocket API for real-time chat

#### UI Framework & Libraries
- **Bootstrap 5** - Responsive CSS framework
  - Grid system
  - Components (cards, modals, forms, buttons)
  - Utility classes
- **Bootstrap Icons** - Icon library
- **Google Fonts (Poppins)** - Typography

### 1.3 Development & Deployment Tools

#### Version Control
- **Git** - Source code version control
- **GitHub** - Repository hosting

#### Development Environment
- **Python 3.12** - Programming language
- **Virtual Environment (venv)** - Dependency isolation
- **pip** - Package manager

#### Deployment Platform
- **Render.com** - Cloud hosting platform
  - Automatic deployments from Git
  - PostgreSQL database hosting
  - Redis for channel layers
  - Environment variable management

#### Testing & Quality Assurance
- **Django Test Framework** - Built-in testing tools
- **Browser DevTools** - Debugging and profiling
- **Lighthouse** - Performance and accessibility auditing
- **WAVE** - Web accessibility evaluation tool

---

## 2. Interactive Features for Disabled and Able Users

### 2.1 Accessibility Features (WCAG 2.1 AA Compliant)

#### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
  - `aria-label` for icon-only buttons
  - `aria-required="true"` for required form fields
  - `aria-invalid` for form validation errors
  - `aria-describedby` linking help text to fields
  - `aria-live` regions for dynamic content announcements
- **Semantic HTML**: Proper use of HTML5 semantic elements
  - `<nav>` for navigation
  - `<main>` for main content
  - `<article>` for product listings
  - `<section>` for content sections
- **Alt Text**: All images include descriptive alt attributes
- **Skip Links**: Keyboard-accessible skip navigation links
  - Skip to main content
  - Skip to navigation
  - Skip to products

#### Keyboard Navigation
- **Tab Order**: Logical tab sequence through all interactive elements
- **Focus Indicators**: Clear 2px outline on focused elements (color: #6B9080)
- **Keyboard Shortcuts**: Common actions accessible via keyboard
- **Escape to Close**: ESC key closes modals and menus
- **Enter/Space Activation**: Buttons and links activate with Enter/Space

#### Visual Accessibility
- **Color Contrast**: WCAG AA compliant (minimum 4.5:1 ratio)
- **Not Color-Dependent**: Information not conveyed by color alone
- **Focus Outlines**: Always visible for keyboard users
- **Large Text Support**: Respects browser text size preferences
- **High Contrast Mode**: Enhanced visibility in high contrast mode

#### Motion Preferences
- **Reduced Motion Support**: Respects `prefers-reduced-motion` media query
- **Animation Control**: Option to disable animations for sensitive users
- **Smooth Transitions**: All animations use CSS transitions (can be disabled)

### 2.2 Voice Commands System

#### Voice Recognition Features
- **Web Speech API Integration**: Browser-native speech recognition
- **Command Recognition**: Natural language command processing
- **Command History**: Tracks recent commands for repeat functionality
- **Command Suggestions**: Context-aware command suggestions
- **Custom Commands**: User-defined custom voice commands

#### Supported Voice Commands
- **Navigation**: "Go to dashboard", "Go to products", "Go to cart"
- **Search**: "Search for [product name]", "Filter by [category]"
- **E-commerce Actions**: "Add to cart", "Remove from cart", "Checkout"
- **Form Interaction**: "Fill [field name]", "Submit form"
- **Browser Control**: "Go back", "Refresh page", "Scroll down"

#### Accessibility Benefits
- **Hands-Free Navigation**: Users with mobility impairments can navigate without mouse
- **Visual Impairment Support**: Screen reader users can use voice commands
- **Efficiency**: Faster navigation for power users

### 2.3 Interactive Features for All Users

#### Visual Feedback & Micro-interactions
- **Hover States**: All interactive elements have clear hover feedback
  - Product cards lift and scale on hover
  - Buttons show ripple effects and lift animations
  - Navigation items show animated underlines
- **Loading States**: Visual feedback during async operations
  - Spinner animations
  - Skeleton screens
  - Progress indicators
- **Success/Error Messages**: Clear visual feedback for user actions
  - Toast notifications
  - Inline error messages
  - Success confirmations

#### Real-Time Features
- **WebSocket Chat**: Real-time messaging between buyers and sellers
  - Typing indicators
  - Read receipts
  - Message delivery status
  - Unread message counters
- **Live Updates**: Dynamic content updates without page refresh
  - Cart updates
  - Inventory changes
  - Price updates

#### Advanced Interactions
- **Drag & Drop**: Image upload with drag-and-drop support
- **Infinite Scroll**: Automatic content loading as user scrolls
- **Modal Dialogs**: Focus management and keyboard navigation
- **Tooltips**: Contextual help information on hover/focus
- **Collapsible Sections**: Expandable/collapsible content areas

---

## 3. Tools Used During Implementation

### 3.1 Development Tools

#### Code Editor & IDE
- **VS Code / Cursor** - Code editor with extensions
  - Python extension
  - Django extension
  - HTML/CSS/JS support
  - Git integration

#### Version Control
- **Git** - Distributed version control
  - Branch management
  - Commit history
  - Merge strategies

#### Package Management
- **pip** - Python package installer
- **requirements.txt** - Dependency specification
- **Virtual Environment** - Isolated Python environment

### 3.2 Design & UI Tools

#### Design Resources
- **Bootstrap 5** - UI component library
- **Bootstrap Icons** - Icon set
- **Google Fonts** - Typography
- **Color Palette**: Custom sage green theme (#6B9080, #4A7C59, #A4C3B2)

#### CSS Tools
- **CSS Grid & Flexbox** - Layout systems
- **CSS Custom Properties** - Theme variables
- **CSS Animations** - Keyframe animations
- **Media Queries** - Responsive design

### 3.3 Testing & Debugging Tools

#### Backend Testing
- **Django Test Framework** - Unit and integration tests
- **Django Debug Toolbar** - Development debugging
- **Python Debugger (pdb)** - Code debugging

#### Frontend Testing
- **Browser DevTools** - Chrome/Firefox developer tools
  - Console for JavaScript debugging
  - Network tab for API monitoring
  - Performance profiling
  - Accessibility tree inspection

#### Accessibility Testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Accessibility auditing
- **Screen Reader Testing**: NVDA, JAWS, VoiceOver
- **Keyboard Navigation Testing**: Tab order verification

### 3.4 Deployment Tools

#### Build & Deployment
- **Render.com** - Cloud hosting platform
- **Gunicorn** - WSGI server
- **Daphne** - ASGI server for WebSockets
- **WhiteNoise** - Static file serving

#### Database Management
- **Django Migrations** - Database schema versioning
- **Django Admin** - Database administration interface
- **SQLite Browser** - Development database inspection

#### Environment Management
- **python-decouple** - Environment variable management
- **.env files** - Configuration storage
- **Render Environment Variables** - Production configuration

### 3.5 Documentation Tools

#### Documentation Format
- **Markdown** - Documentation markup
- **README files** - Project documentation
- **API Documentation** - REST API reference
- **Code Comments** - Inline documentation

---

## 4. Backend Design

### 4.1 Architecture Overview

**Architecture Pattern**: Model-View-Template (MVT) with REST API

```
┌─────────────────────────────────────────────────┐
│              Client (Browser)                    │
└───────────────┬─────────────────────────────────┘
                │
                │ HTTP/HTTPS
                │ WebSocket (WS/WSS)
                │
┌───────────────▼─────────────────────────────────┐
│         Django Application Layer                 │
│  ┌──────────────────────────────────────────┐   │
│  │         URL Routing (urls.py)           │   │
│  └──────────────┬─────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼─────────────────────────┐   │
│  │      Views (views.py, api_views.py)     │   │
│  └──────────────┬─────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼─────────────────────────┐   │
│  │      Models (models.py)                 │   │
│  └──────────────┬─────────────────────────┘   │
│                 │                               │
│  ┌──────────────▼─────────────────────────┐   │
│  │      Database (PostgreSQL/SQLite)       │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 4.2 Application Structure

```
KoraQuest-main/
├── InzuLink/              # Project configuration
│   ├── settings.py        # Django settings
│   ├── urls.py            # Root URL configuration
│   ├── asgi.py            # ASGI application (WebSocket)
│   ├── wsgi.py            # WSGI application (HTTP)
│   └── routing.py         # WebSocket routing
│
├── authentication/        # Main application
│   ├── models.py          # Database models (8 models)
│   ├── views.py           # View functions (50+ views)
│   ├── api_views.py       # Function-based API views
│   ├── api_views_rest.py  # REST API ViewSets
│   ├── serializers.py     # API serializers
│   ├── forms.py           # Django forms
│   ├── urls.py            # Application URLs
│   ├── api_urls.py        # REST API URLs
│   ├── consumers.py       # WebSocket consumers
│   ├── chat_views.py      # Chat-related views
│   ├── momo_payment.py    # Payment integration
│   ├── paypack_payment.py # Paypack payment handler
│   ├── qr_utils.py        # QR code utilities
│   ├── otp_utils.py       # OTP generation/verification
│   └── templates/         # HTML templates (38 templates)
│
├── static/                # Static files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Images
│
├── media/                 # User-uploaded files
│   ├── profile_pics/      # Profile pictures
│   ├── posts/             # Product images
│   ├── qr_codes/          # QR code images
│   └── product_gallery/   # Product gallery images
│
└── docs/                  # Documentation
```

### 4.3 Database Models

#### Core Models (8 Models)

1. **User Model** (Custom User)
   - Extends Django's AbstractUser
   - Roles: user, vendor, staff, inzulink
   - Profile picture, phone number
   - Sales/purchase statistics

2. **Post Model** (Products/Properties)
   - Property types: house, land, furniture
   - 18+ categories
   - Price, location, condition
   - Real estate fields (bedrooms, bathrooms, size_sqm)
   - Inventory tracking
   - View and inquiry counts

3. **Purchase Model**
   - Order tracking (ORD-XXXXXXXX)
   - Buyer and property relationships
   - Payment status and methods
   - Delivery tracking (for furniture)
   - Status workflow

4. **PropertyInquiry Model**
   - Inquiry workflow (new → contacted → viewing_scheduled → completed)
   - Buyer messages and contact info
   - Viewing scheduling
   - Price negotiation

5. **ListingFee Model**
   - Daily subscription fees
   - Fee calculation based on property value
   - Payment tracking
   - Auto-renewal support

6. **ProductReview Model**
   - 1-5 star ratings
   - Review comments
   - Reviewer tracking

7. **Conversation Model** (Chat)
   - Buyer-seller conversations
   - Property-linked conversations
   - Read tracking
   - Status management

8. **Message Model** (Chat)
   - Individual chat messages
   - Read receipts
   - Soft delete support
   - Attachment support (future)

#### Supporting Models
- **Bookmark** - Saved products
- **Cart** - Shopping cart
- **CartItem** - Cart items
- **ProductImage** - Product gallery
- **UserQRCode** - QR code system
- **OTPVerification** - OTP management

### 4.4 API Architecture

#### REST API Endpoints (30+ endpoints)

**Authentication:**
- `POST /auth/api/rest/auth/register/` - User registration
- `POST /auth/api/rest/auth/login/` - User login
- `POST /auth/api/rest/auth/logout/` - User logout

**Users:**
- `GET /auth/api/rest/users/` - List users
- `GET /auth/api/rest/users/me/` - Current user
- `PUT/PATCH /auth/api/rest/users/update_me/` - Update profile
- `POST /auth/api/rest/users/{id}/become_vendor/` - Upgrade to vendor

**Products:**
- `GET /auth/api/rest/posts/` - List products (with filtering)
- `POST /auth/api/rest/posts/` - Create product
- `GET /auth/api/rest/posts/{id}/` - Product details
- `PUT/PATCH /auth/api/rest/posts/{id}/` - Update product
- `DELETE /auth/api/rest/posts/{id}/` - Delete product
- `POST /auth/api/rest/posts/{id}/like/` - Like product
- `POST /auth/api/rest/posts/{id}/bookmark/` - Bookmark product
- `POST /auth/api/rest/posts/{id}/purchase/` - Purchase product
- `POST /auth/api/rest/posts/{id}/add_review/` - Add review

**Purchases:**
- `GET /auth/api/rest/purchases/` - List purchases
- `GET /auth/api/rest/purchases/{id}/` - Purchase details
- `POST /auth/api/rest/purchases/{id}/update_status/` - Update status

**Reviews:**
- `GET /auth/api/rest/reviews/` - List reviews
- `PUT/PATCH /auth/api/rest/reviews/{id}/` - Update review
- `DELETE /auth/api/rest/reviews/{id}/` - Delete review

**QR & OTP:**
- `POST /auth/api/rest/qr-codes/generate_qr/` - Generate QR code
- `POST /auth/api/rest/otp/send_otp/` - Send OTP
- `POST /auth/api/rest/otp/verify_otp/` - Verify OTP

**Analytics:**
- `GET /auth/api/rest/dashboard/stats/` - Dashboard statistics
- `GET /auth/api/rest/vendors/{id}/statistics/` - Vendor statistics

#### API Features
- **Filtering**: Django-filter backend (category, price, availability)
- **Searching**: Full-text search (title, description, vendor)
- **Ordering**: Sort by date, price, popularity
- **Pagination**: Page-based pagination (20 items per page)
- **Authentication**: Session-based authentication
- **Permissions**: Role-based access control
- **Error Handling**: Standardized error responses
- **CORS**: Cross-origin resource sharing enabled

### 4.5 WebSocket Architecture

#### WebSocket Routing
```python
# InzuLink/routing.py
websocket_urlpatterns = [
    path('ws/chat/<int:conversation_id>/', ChatConsumer.as_asgi()),
]
```

#### WebSocket Consumer
- **ChatConsumer** - Handles real-time chat messages
  - Message sending/receiving
  - Typing indicators
  - Read receipts
  - User presence

#### Channel Layers
- **Development**: In-memory channel layer
- **Production**: Redis channel layer (channels-redis)

---

## 5. How the Backend Connects to the Frontend

### 5.1 Connection Methods

#### Method 1: Template Rendering (Server-Side Rendering)

**Flow:**
```
User Request → Django URL Router → View Function → Template Rendering → HTML Response
```

**Implementation:**
- Django templates (`authentication/templates/authentication/*.html`)
- Template inheritance via `base.html`
- Context processors inject data into templates
- Server-side rendering with Django template language

**Example:**
```python
# views.py
def dashboard(request):
    products = Post.objects.all()
    context = {'products': products}
    return render(request, 'authentication/dashboard.html', context)
```

```html
<!-- dashboard.html -->
{% for product in products %}
    <div class="product-card">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price }}</p>
    </div>
{% endfor %}
```

**Use Cases:**
- Initial page loads
- SEO-friendly content
- Server-side data processing
- Form submissions

#### Method 2: REST API (Client-Side Rendering)

**Flow:**
```
JavaScript (Frontend) → Fetch/AJAX Request → Django REST API → JSON Response → DOM Update
```

**Implementation:**
- Django REST Framework endpoints
- JavaScript Fetch API or XMLHttpRequest
- JSON data exchange
- Dynamic DOM manipulation

**Example:**
```javascript
// Frontend JavaScript
fetch('/auth/api/rest/posts/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include' // Include session cookie
})
.then(response => response.json())
.then(data => {
    // Update DOM with products
    data.results.forEach(product => {
        // Render product card
    });
});
```

```python
# api_views_rest.py
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
```

**Use Cases:**
- Dynamic content updates
- Search and filtering
- Cart management
- Real-time data fetching
- Single Page Application (SPA) features

#### Method 3: WebSocket (Real-Time Communication)

**Flow:**
```
JavaScript WebSocket → Django Channels → WebSocket Consumer → Broadcast → All Connected Clients
```

**Implementation:**
- Django Channels for WebSocket support
- ASGI application (Daphne server)
- JavaScript WebSocket API
- Channel layers for message broadcasting

**Example:**
```javascript
// Frontend JavaScript
const chatSocket = new WebSocket(
    'wss://inzulink.bonasolutions.tech/ws/chat/123/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    // Display message in chat UI
};

chatSocket.send(JSON.stringify({
    'message': 'Hello!',
    'sender': 'user123'
}));
```

```python
# consumers.py
class ChatConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        
        # Save to database
        # Broadcast to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
```

**Use Cases:**
- Real-time chat
- Live notifications
- Collaborative features
- Live updates

#### Method 4: Static Files

**Flow:**
```
Browser Request → Django Static Files Handler → CSS/JS/Images → Browser Cache
```

**Implementation:**
- WhiteNoise middleware for production
- Django static files handling
- Static file collection (`collectstatic`)
- CDN-ready structure

**Configuration:**
```python
# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
```

**Use Cases:**
- CSS stylesheets
- JavaScript files
- Images and icons
- Fonts

### 5.2 Data Flow Examples

#### Example 1: Product Listing Page

**Server-Side Rendering:**
1. User visits `/auth/dashboard/`
2. Django URL router matches pattern
3. `dashboard()` view function executes
4. Query database for products
5. Render template with product data
6. Return HTML response to browser
7. Browser displays page

**Client-Side API Call:**
1. Page loads with empty product container
2. JavaScript executes on page load
3. Fetch API calls `/auth/api/rest/posts/`
4. Django REST API returns JSON
5. JavaScript renders products in DOM
6. User sees products

#### Example 2: Real-Time Chat

1. User opens chat room
2. JavaScript establishes WebSocket connection
3. User types message and clicks send
4. JavaScript sends message via WebSocket
5. Django Channels receives message
6. ChatConsumer processes message
7. Message saved to database
8. Message broadcasted to all users in conversation
9. All connected clients receive message
10. JavaScript updates chat UI

#### Example 3: Add to Cart

1. User clicks "Add to Cart" button
2. JavaScript prevents default form submission
3. Fetch API sends POST request to `/auth/api/rest/posts/{id}/purchase/`
4. Django REST API processes request
5. Creates CartItem in database
6. Returns success response
7. JavaScript updates cart UI (badge count, cart display)
8. Shows success notification

### 5.3 Authentication Flow

#### Session-Based Authentication

**Login Flow:**
1. User submits login form
2. POST request to `/auth/login/`
3. Django authenticates user
4. Session created and stored
5. Session cookie sent to browser
6. Browser stores cookie
7. Subsequent requests include cookie
8. Django middleware validates session
9. User authenticated for request

**API Authentication:**
- Session authentication for REST API
- Cookie-based session management
- CSRF token protection
- Credentials included in Fetch requests (`credentials: 'include'`)

### 5.4 Error Handling

#### Server-Side Errors
- Django error pages (development)
- Custom error templates (production)
- Error logging

#### API Errors
- Standardized JSON error responses
- HTTP status codes (400, 401, 403, 404, 500)
- Field-specific error messages
- Frontend error handling in JavaScript

#### WebSocket Errors
- Connection error handling
- Reconnection logic
- Error message display

---

## 6. Summary

### Key Strengths

1. **Multiple Integration Methods**: Server-side rendering, REST API, and WebSockets provide flexibility
2. **Accessibility First**: WCAG 2.1 AA compliant with comprehensive screen reader support
3. **Modern Architecture**: Django 5.1.4 with REST API and WebSocket support
4. **Production Ready**: Deployed and live with proper error handling and security
5. **Comprehensive Features**: Full e-commerce functionality with real-time chat

### Technology Stack Summary

- **Backend**: Django 5.1.4 + Django REST Framework + Django Channels
- **Database**: PostgreSQL (production) / SQLite (development)
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript + Bootstrap 5
- **Real-Time**: WebSocket via Django Channels
- **Deployment**: Render.com with Gunicorn/Daphne
- **Payment**: Paypack SDK for Mobile Money

### Human-Centered Design Principles

- ✅ **Accessibility**: Screen reader support, keyboard navigation, WCAG compliance
- ✅ **Usability**: Clear navigation, intuitive interactions, helpful feedback
- ✅ **Inclusivity**: Features for disabled and able users alike
- ✅ **Performance**: Optimized loading, efficient queries, caching
- ✅ **Responsiveness**: Mobile-first design, touch-optimized

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Project Status**: Production-Ready

