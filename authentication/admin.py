from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Post, Purchase, Bookmark, ProductImage, 
    UserQRCode, OTPVerification, ProductReview,
    PropertyInquiry, ListingFee, Conversation, Message
)

class UserAdmin(BaseUserAdmin):
    # Add the custom fields to the admin interface
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone_number', 'role', 'is_vendor_role', 'profile_picture', 'total_sales', 'total_purchases')
        }),
    )
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_vendor_role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_vendor_role', 'is_staff', 'is_active')

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'property_type', 'category', 'price', 'is_active', 'is_sold', 'created_at')
    list_filter = ('property_type', 'category', 'is_active', 'is_sold', 'created_at')
    search_fields = ('title', 'description', 'location_address', 'location_city')

class PropertyInquiryAdmin(admin.ModelAdmin):
    list_display = ('inquiry_id', 'buyer', 'property', 'status', 'created_at')
    list_filter = ('status', 'viewing_confirmed', 'viewing_completed', 'created_at')
    search_fields = ('buyer__username', 'property__title', 'inquiry_id')

class ListingFeeAdmin(admin.ModelAdmin):
    list_display = ('listing', 'vendor', 'daily_fee', 'days_paid', 'payment_status', 'start_date', 'end_date')
    list_filter = ('payment_status', 'auto_renew', 'created_at')
    search_fields = ('listing__title', 'vendor__username', 'payment_reference')

class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'buyer', 'property', 'final_price', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('buyer__username', 'property__title', 'order_id')

class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('reviewer__username', 'product__title')

# Chat Admin Classes
class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('sender', 'content', 'is_read', 'created_at')
    can_delete = False
    max_num = 20  # Show last 20 messages inline

class ConversationAdmin(admin.ModelAdmin):
    list_display = ('conversation_id', 'buyer', 'seller', 'property', 'status', 'last_message_at', 'created_at')
    list_filter = ('status', 'created_at', 'last_message_at')
    search_fields = ('conversation_id', 'buyer__username', 'seller__username', 'property__title')
    readonly_fields = ('conversation_id', 'created_at', 'updated_at')
    inlines = [MessageInline]
    
    fieldsets = (
        ('Conversation Info', {
            'fields': ('conversation_id', 'status')
        }),
        ('Participants', {
            'fields': ('buyer', 'seller')
        }),
        ('Context', {
            'fields': ('property', 'inquiry')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_message_at'),
            'classes': ('collapse',)
        }),
        ('Read Tracking', {
            'fields': ('buyer_last_read', 'seller_last_read'),
            'classes': ('collapse',)
        }),
    )

class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'short_content', 'is_read', 'created_at')
    list_filter = ('is_read', 'is_deleted', 'created_at')
    search_fields = ('content', 'sender__username', 'conversation__conversation_id')
    readonly_fields = ('created_at', 'updated_at', 'read_at', 'deleted_at')
    
    def short_content(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    short_content.short_description = 'Content Preview'

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(PropertyInquiry, PropertyInquiryAdmin)
admin.site.register(ListingFee, ListingFeeAdmin)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(ProductReview, ProductReviewAdmin)
admin.site.register(Bookmark)
admin.site.register(ProductImage)
admin.site.register(UserQRCode)
admin.site.register(OTPVerification)

# Chat models
admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Message, MessageAdmin)
