# Voice Commands - Page-by-Page Analysis & Implementation Plan 📋

## Overview
This document analyzes each page of the InzuLink platform to identify specific voice commands needed for optimal user experience. Commands will be implemented page by page.

---

## 📊 **Implementation Strategy**

### **Approach:**
1. Analyze each page's functionality
2. Identify interactive elements and actions
3. Design voice commands for each action
4. Implement commands one page at a time
5. Test and refine

### **Priority Levels:**
- **🔴 High Priority** - Core functionality, frequently used
- **🟡 Medium Priority** - Useful but less critical
- **🟢 Low Priority** - Nice to have, edge cases

---

## 📄 **Page Analysis**

### **1. Home Page (`/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "View featured products" - Scroll to featured section
- 🔴 "Browse categories" - Scroll to categories section
- 🟡 "Show statistics" - Scroll to platform stats
- 🟡 "Get started" - Navigate to register
- 🟢 "Read about us" - Scroll to about section (if exists)

**Implementation Priority:** Medium

---

### **2. Login Page (`/auth/login/`)**
**Current Commands:** ✅ Basic navigation, form filling

**Additional Commands Needed:**
- 🔴 "Login" / "Sign in" - Submit login form (after filling)
- 🔴 "Forgot password" - Navigate to password reset (if exists)
- 🟡 "Remember me" - Toggle remember me checkbox
- 🟢 "Show password" - Toggle password visibility (already works)

**Implementation Priority:** High

---

### **3. Register Page (`/auth/register/`)**
**Current Commands:** ✅ Basic navigation, form filling

**Additional Commands Needed:**
- 🔴 "Create account" / "Register" - Submit registration form
- 🟡 "Accept terms" - Toggle terms checkbox
- 🟢 "Show password requirements" - Announce password rules

**Implementation Priority:** High

---

### **4. Dashboard/Products Page (`/auth/dashboard/`)** ✅ **COMPLETE**
**Current Commands:** ✅ Search, filter, navigation, product actions, sorting, filtering, pagination

**Commands Implemented:**
- ✅ "Like [product]" - Like a product on the page by name
- ✅ "Bookmark [product]" / "Save [product]" - Bookmark a product by name
- ✅ "View [product]" / "Show [product]" - Navigate to product detail by name
- ✅ "Sort by [newest/price/popular/rating]" - Change sort order
- ✅ "Filter by [category]" / "Show [category]" - Filter by category
- ✅ "Clear filters" / "Show all" - Reset all filters
- ✅ "Next product" / "Previous product" - Navigate between products
- ✅ "Next page" / "Show more" - Load next page
- ✅ "Previous page" / "Go back" - Load previous page
- ✅ "First page" - Go to first page

**Status:** ✅ Complete - All high and medium priority commands implemented

---

### **5. Product Detail Page (`/auth/post/<id>/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Add to cart" - Add current product to cart
- 🔴 "Send inquiry" / "Contact seller" - Open inquiry modal
- 🔴 "Start chat" - Start chat with seller
- 🔴 "Like this" / "Unlike this" - Toggle like
- 🔴 "Bookmark this" / "Save this" - Toggle bookmark
- 🔴 "Share product" - Open share dialog
- 🟡 "View reviews" - Scroll to reviews section
- 🟡 "Write review" - Scroll to review form
- 🟡 "Next image" / "Previous image" - Navigate product images
- 🟡 "Show full description" - Expand description
- 🟢 "Read description" - Announce full description
- 🟢 "Show seller info" - Display seller details

**Implementation Priority:** Very High

---

### **6. Cart Page (`/auth/cart/`)**
**Current Commands:** ✅ Remove, clear, update quantity, checkout

**Additional Commands Needed:**
- 🔴 "Proceed to checkout" - Navigate to checkout (already works)
- 🟡 "Update [product] to [quantity]" - Update specific item (already works)
- 🟡 "Show total" - Announce cart total
- 🟡 "Continue shopping" - Navigate back to dashboard
- 🟢 "Calculate shipping" - Show shipping info (if exists)

**Implementation Priority:** Low (mostly done)

---

### **7. Checkout Page (`/auth/checkout/`)**
**Current Commands:** ✅ Form filling, submit

**Additional Commands Needed:**
- 🔴 "Complete purchase" / "Place order" - Submit checkout form
- 🔴 "Select payment method [method]" - Choose payment option
- 🟡 "Review order" - Scroll to order summary
- 🟡 "Edit delivery address" - Focus on address field
- 🟡 "Apply coupon" - Open coupon field (if exists)
- 🟢 "Calculate total" - Announce final total

**Implementation Priority:** High

---

### **8. Purchase History (`/auth/purchases/`)**
**Current Commands:** ✅ Basic navigation, track order

**Additional Commands Needed:**
- 🔴 "View order [number]" - Open order details
- 🔴 "Track order [number]" - Navigate to order tracking
- 🟡 "Filter by status [status]" - Filter orders (pending, completed, etc.)
- 🟡 "Show recent orders" - Filter to recent
- 🟡 "Search orders" - Search in order history
- 🟢 "Export orders" - Download order list (if exists)

**Implementation Priority:** Medium

---

### **9. Purchase Detail Page (`/auth/purchase/<id>/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Confirm payment" - Confirm payment received
- 🔴 "Update delivery status" - Change delivery status
- 🔴 "Mark as delivered" - Update to delivered
- 🟡 "Contact vendor" - Start chat with vendor
- 🟡 "View product" - Navigate to product page
- 🟡 "Download receipt" - Download invoice (if exists)
- 🟢 "Cancel order" - Cancel purchase (if allowed)

**Implementation Priority:** High

---

### **10. Bookmarks Page (`/auth/bookmarks/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Remove [product] from bookmarks" - Unbookmark item
- 🔴 "View [product]" - Navigate to product
- 🟡 "Clear all bookmarks" - Remove all bookmarks
- 🟡 "Sort bookmarks" - Sort by date/name
- 🟢 "Share bookmarks" - Share bookmark list

**Implementation Priority:** Medium

---

### **11. Vendor Dashboard (`/auth/vendor-dashboard/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Add new product" - Navigate to create product
- 🔴 "View product [name]" - Open product detail
- 🔴 "Edit product [name]" - Edit product
- 🔴 "View sales" - Navigate to sales statistics
- 🟡 "Show pending payments" - Navigate to pending payments
- 🟡 "Show awaiting delivery" - Navigate to delivery page
- 🟡 "Filter products by [status]" - Filter product list
- 🟢 "Export sales data" - Download report

**Implementation Priority:** High

---

### **12. Create/Edit Product Page (`/auth/create-product/`, `/auth/edit-product/<id>/`)**
**Current Commands:** ✅ Form filling, submit

**Additional Commands Needed:**
- 🔴 "Save product" / "Publish product" - Submit form
- 🔴 "Save draft" - Save without publishing (if exists)
- 🟡 "Upload image" - Focus on image upload
- 🟡 "Preview product" - Show preview (if exists)
- 🟡 "Add another image" - Add auxiliary image
- 🟢 "Validate form" - Check all fields (already works)

**Implementation Priority:** Medium

---

### **13. Settings Page (`/auth/settings/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Save changes" - Submit settings form
- 🔴 "Update profile" - Save profile changes
- 🔴 "Change password" - Navigate to password change
- 🟡 "Upload profile picture" - Focus on image upload
- 🟡 "Delete account" - Open delete confirmation (if exists)
- 🟢 "Export data" - Download user data

**Implementation Priority:** Medium

---

### **14. Chat List Page (`/auth/chat/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Open chat with [name]" - Navigate to chat room
- 🔴 "Start new chat" - Create new conversation
- 🟡 "Mark all as read" - Mark all messages read
- 🟡 "Search conversations" - Filter chat list
- 🟡 "Archive chat [name]" - Archive conversation
- 🟢 "Delete chat [name]" - Delete conversation

**Implementation Priority:** High

---

### **15. Chat Room Page (`/auth/chat/<id>/`)**
**Current Commands:** ✅ Basic navigation, form filling

**Additional Commands Needed:**
- 🔴 "Send message [text]" - Send chat message
- 🔴 "Type [message]" - Fill and send message
- 🟡 "Scroll to top" - Scroll to first message
- 🟡 "Scroll to bottom" - Scroll to latest message
- 🟡 "Mark as read" - Mark conversation read
- 🟢 "Search messages" - Search in conversation
- 🟢 "Share conversation" - Share chat (if exists)

**Implementation Priority:** High

---

### **16. My Inquiries Page (`/auth/my-inquiries/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "View inquiry [id]" - Open inquiry details
- 🔴 "Reply to inquiry [id]" - Respond to inquiry
- 🟡 "Filter by status" - Filter inquiries
- 🟡 "Delete inquiry [id]" - Remove inquiry
- 🟢 "Export inquiries" - Download list

**Implementation Priority:** Medium

---

### **17. Received Inquiries Page (`/auth/received-inquiries/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "View inquiry [id]" - Open inquiry details
- 🔴 "Reply to inquiry [id]" - Respond to inquiry
- 🔴 "Create purchase from inquiry [id]" - Convert to purchase
- 🟡 "Mark as read" - Mark inquiry read
- 🟡 "Filter inquiries" - Filter by status/date

**Implementation Priority:** High

---

### **18. Inquiry Detail Page (`/auth/inquiry/<id>/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Reply to inquiry" - Open reply form
- 🔴 "Create purchase" - Convert inquiry to purchase
- 🟡 "Start chat" - Open chat from inquiry
- 🟡 "View property" - Navigate to property page
- 🟢 "Delete inquiry" - Remove inquiry

**Implementation Priority:** Medium

---

### **19. Pay Listing Fee Page (`/auth/listing/<id>/pay-fee/`)**
**Current Commands:** ✅ Form filling, submit

**Additional Commands Needed:**
- 🔴 "Pay fee" / "Submit payment" - Submit payment form
- 🔴 "Select payment method [method]" - Choose payment
- 🟡 "Calculate fee" - Announce fee amount
- 🟡 "Set auto renew" - Toggle auto-renew checkbox
- 🟢 "View payment history" - Navigate to listing fees

**Implementation Priority:** Medium

---

### **20. Sales Statistics Page (`/auth/sales-statistics/`)**
**Current Commands:** ✅ Basic navigation

**Additional Commands Needed:**
- 🔴 "Filter by date [range]" - Filter statistics
- 🔴 "Export report" - Download statistics
- 🟡 "Show top products" - Scroll to top sellers
- 🟡 "Show revenue chart" - Focus on revenue section
- 🟢 "Compare periods" - Compare time periods

**Implementation Priority:** Low

---

## 🎯 **Implementation Plan**

### **Phase 6: Page-Specific Commands (Current Phase)**

#### **Week 1: High Priority Pages**
1. ✅ Product Detail Page - Like, bookmark, add to cart, inquiry, chat
2. ✅ Dashboard Page - Like, bookmark, view product, sort
3. ✅ Chat Room - Send message, scroll messages
4. ✅ Checkout Page - Complete purchase, payment method

#### **Week 2: Medium Priority Pages**
5. Purchase Detail - Confirm payment, update delivery
6. Vendor Dashboard - Add product, view sales, manage products
7. Received Inquiries - Reply, create purchase
8. Chat List - Open chat, start new chat

#### **Week 3: Remaining Pages**
9. Bookmarks - Remove, view, clear all
10. Settings - Save changes, update profile
11. My Inquiries - View, reply, filter
12. Create/Edit Product - Save, preview

---

## 📝 **Command Patterns to Implement**

### **Product Actions:**
- "Like [product]" → Find product, click like button
- "Bookmark [product]" → Find product, click bookmark
- "View [product]" → Navigate to product detail
- "Add [product] to cart" → Already implemented ✅

### **Chat Commands:**
- "Send message [text]" → Fill input, submit
- "Open chat with [name]" → Find conversation, navigate
- "Start chat about [product]" → Create new conversation

### **Inquiry Commands:**
- "Send inquiry about [product]" → Open inquiry modal, fill form
- "Reply to inquiry [id]" → Navigate to inquiry, open reply form

### **Vendor Commands:**
- "Add new product" → Navigate to create product
- "Edit [product name]" → Find product, navigate to edit
- "View sales for [period]" → Filter sales statistics

### **Order Commands:**
- "Confirm payment for order [number]" → Navigate to order, confirm
- "Update delivery for order [number]" → Change delivery status
- "Mark order [number] as delivered" → Update status

---

## 🔧 **Technical Implementation Notes**

### **Product Identification:**
- Use product title matching (fuzzy search)
- Support partial matches
- Handle multiple products with similar names
- Use data attributes (data-post-id, data-product-id)

### **Button/Action Identification:**
- Use data attributes (data-like, data-bookmark)
- Find by button text/label
- Use ARIA labels for accessibility
- Support multiple button variations

### **Modal Handling:**
- Detect modal open/close
- Focus management for modals
- Form filling in modals
- Submit modal forms

### **Dynamic Content:**
- Handle AJAX-loaded content
- Wait for content to load
- Retry if element not found
- Support infinite scroll pages

---

## 📊 **Progress Tracking**

### **Pages Completed:** 2/20 ✅
- ✅ Product Detail Page (`/auth/post/<id>/`)
- ✅ Dashboard/Products Page (`/auth/dashboard/`)

### **Commands Implemented:** 30+ commands

**Product Detail Page (15+ commands):**
- ✅ Like/Unlike (2 commands)
- ✅ Bookmark/Save (2 commands)
- ✅ Add to cart (1 command)
- ✅ Send inquiry (1 command)
- ✅ Start chat (1 command)
- ✅ Share product (1 command)
- ✅ Image navigation (3 commands)
- ✅ Review navigation (2 commands)
- ✅ Read description (1 command)

**Dashboard Page (15+ commands):**
- ✅ Like product by name (1 command)
- ✅ Bookmark product by name (1 command)
- ✅ View product by name (1 command)
- ✅ Sort commands (5 commands: newest, price low, price high, popular, rating)
- ✅ Filter by category (1 command)
- ✅ Clear filters (1 command)
- ✅ Product navigation (2 commands: next, previous)
- ✅ Pagination (3 commands: next page, previous page, first page)

### **Current Phase:** Phase 7 - Page-Specific Commands
### **Next Page:** TBD (Home Page, Login Page, Register Page, or Cart Page)

---

## 🚀 **Next Steps**

1. ✅ **Product Detail Page** - Complete
   - All high priority commands implemented
   - Tested and working

2. ✅ **Dashboard Page** - Complete
   - All high and medium priority commands implemented
   - Product search, sorting, filtering, and navigation working

3. **Continue page by page**
   - Follow priority order
   - Test each implementation
   - Gather user feedback
   - **Suggested next:** Home Page, Login Page, Register Page, or Cart Page

---

*Last Updated: 2024*
*Version: 1.0*


