from django.urls import path, include
from . import views
from . import api_views
from . import chat_views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('settings/', views.user_settings, name='user_settings'),
    
    # Post creation and interaction
    path('create-post/', views.create_post, name='create_post'),
    path('create-product/', views.create_product, name='create_product'),
    path('edit-product/<int:product_id>/', views.edit_product, name='edit_product'),
    path('like-post/<int:post_id>/', views.like_post, name='like_post'),
    
    # Post detail and actions
    path('post/<int:post_id>/', views.post_detail, name='post_detail'),
    path('post/<int:post_id>/inquiry/', views.send_property_inquiry, name='send_property_inquiry'),
    path('post/<int:post_id>/purchase/', views.send_property_inquiry, name='purchase_product'),  # Keep old URL for compatibility
    path('bookmark/<int:post_id>/', views.bookmark_toggle, name='bookmark_toggle'),
    
    # Property Inquiry Management
    path('my-inquiries/', views.my_inquiries, name='my_inquiries'),
    path('received-inquiries/', views.received_inquiries, name='received_inquiries'),
    path('inquiry/<str:inquiry_id>/', views.inquiry_detail, name='inquiry_detail'),
    path('inquiry/<str:inquiry_id>/create-purchase/', views.create_purchase_from_inquiry, name='create_purchase_from_inquiry'),
    
    # Listing Fee Management
    path('listing/<int:listing_id>/pay-fee/', views.pay_listing_fee, name='pay_listing_fee'),
    path('listing/<int:listing_id>/payment-status/<str:transaction_id>/', views.check_payment_status, name='check_payment_status'),
    path('my-listing-fees/', views.my_listing_fees, name='my_listing_fees'),
    
    # MoMo Payment Callback (webhook)
    path('api/momo/callback/', views.momo_payment_callback, name='momo_payment_callback'),
    
    # User dashboards
    path('vendor-dashboard/', views.vendor_dashboard, name='vendor_dashboard'),
    path('purchase/<int:purchase_id>/confirm-payment/', views.confirm_payment, name='confirm_payment'),
    
    # User history and saved items
    path('purchases/', views.purchase_history, name='purchase_history'),
    path('purchase/<int:purchase_id>/', views.purchase_detail, name='purchase_detail'),
    path('bookmarks/', views.bookmarks, name='bookmarks'),
    
    # Cart functionality
    path('cart/', views.view_cart, name='view_cart'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/update/<int:item_id>/', views.update_cart_item, name='update_cart_item'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/clear/', views.clear_cart, name='clear_cart'),
    
    # Checkout
    path('checkout/', views.checkout, name='checkout'),
    path('checkout/process/', views.process_checkout, name='process_checkout'),
    
    # Delivery tracking
    path('purchase/<int:purchase_id>/update-delivery/', views.update_delivery_status, name='update_delivery_status'),
    
    # Legacy paths (kept for compatibility)
    path('become-vendor/', views.become_vendor, name='become_vendor'),
    
    # ==============================================
    # Chat URLs - Real-time messaging
    # ==============================================
    path('chat/', chat_views.chat_list, name='chat_list'),
    path('chat/<int:conversation_id>/', chat_views.chat_room, name='chat_room'),
    path('chat/start/property/<int:property_id>/', chat_views.start_conversation, name='start_chat_property'),
    path('chat/start/user/<int:user_id>/', chat_views.start_conversation, name='start_chat_user'),
    path('chat/start/inquiry/<str:inquiry_id>/', chat_views.start_conversation_from_inquiry, name='start_chat_inquiry'),
    
    # Chat API endpoints
    path('api/chat/conversations/', chat_views.api_conversations, name='api_conversations'),
    path('api/chat/<int:conversation_id>/messages/', chat_views.api_get_messages, name='api_get_messages'),
    path('api/chat/<int:conversation_id>/send/', chat_views.api_send_message, name='api_send_message'),
    path('api/chat/<int:conversation_id>/read/', chat_views.api_mark_read, name='api_mark_read'),
    path('api/chat/<int:conversation_id>/archive/', chat_views.api_archive_conversation, name='api_archive_conversation'),
    path('api/chat/unread/', chat_views.api_unread_count, name='api_unread_count'),
    
    # InzuLink specific URLs
    path('qr-code/', views.user_qr_code, name='user_qr_code'),
    path('inzulink-dashboard/', views.inzulink_dashboard, name='inzulink_dashboard'),
    path('scan-qr/', views.scan_qr_code, name='scan_qr_code'),
    path('confirm-pickup/<int:purchase_id>/', views.confirm_purchase_pickup, name='confirm_purchase_pickup'),
    path('confirm-delivery/<int:purchase_id>/', views.confirm_delivery, name='confirm_delivery'),
    path('update-qr-ajax/', views.update_qr_code_ajax, name='update_qr_code_ajax'),
    path('inzulink-history/', views.inzulink_purchase_history, name='inzulink_purchase_history'),
    path('sales-statistics/', views.sales_statistics, name='sales_statistics'),
    path('vendor-statistics/<int:vendor_id>/', views.vendor_statistics_for_inzulink, name='vendor_statistics_for_inzulink'),
    
    # API endpoints for QR code scanning and verification flow
    path('api/purchases/by-qr/', api_views.get_purchases_by_qr, name='api_get_purchases_by_qr'),
    path('api/verify-credentials/', api_views.verify_buyer_credentials, name='api_verify_credentials'),
    path('api/send-otp/', api_views.send_otp, name='api_send_otp'),
    path('api/verify-otp/', api_views.verify_otp_view, name='api_verify_otp'),
    path('api/complete-purchase/', api_views.complete_purchase_pickup, name='api_complete_purchase'),
    path('api/vendor-statistics/<int:vendor_id>/', api_views.get_vendor_statistics_modal, name='api_vendor_statistics_modal'),
    
    # REST API endpoints
    path('api/rest/', include('authentication.api_urls')),
]

# API endpoints
api_endpoints = [
    path('v1/register/', views.register_api, name='register_api'),
    path('v1/login/', views.login_api, name='login_api'),
    path('v1/logout/', views.logout_api, name='logout_api'),
    path('v1/dashboard/', views.dashboard_api, name='dashboard_api'),
    path('v1/bookmark/<int:post_id>/', views.bookmark_toggle_api, name='bookmark_toggle_api'),
    path('v1/like/<int:post_id>/', views.like_post_api, name='like_post_api'),
    path('v1/categories/', views.categories_api, name='categories_api'),
]

# Add api_endpoints to main urlpatterns
urlpatterns += api_endpoints