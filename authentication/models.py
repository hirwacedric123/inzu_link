from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class User(AbstractUser):
    USER_ROLES = (
        ('user', 'User'),
        ('staff', 'Staff'), 
        ('vendor', 'Vendor'),
        ('inzulink', 'InzuLink'),
    )
    
    # Base role for all users
    role = models.CharField(max_length=20, choices=USER_ROLES, default='user')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Additional role flags to support multiple roles
    is_vendor_role = models.BooleanField(default=False)
    
    # Profile picture
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    
    # Stats
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_purchases = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def is_user(self):
        return self.role == 'user' and not self.is_vendor_role
    
    def is_staff_member(self):
        return self.role == 'staff'
    
    def is_vendor(self):
        return self.is_vendor_role
    
    def is_koraquest(self):
        return self.role == 'inzulink'

class Post(models.Model):
    # Property Type Choices
    PROPERTY_TYPE_CHOICES = (
        ('house', 'House'),
        ('land', 'Land Plot'),
        ('furniture', 'Furniture'),
    )
    
    # Category choices based on property type
    CATEGORY_CHOICES = (
        # Houses
        ('apartment', 'Apartment'),
        ('villa', 'Villa'),
        ('townhouse', 'Townhouse'),
        ('duplex', 'Duplex'),
        ('studio', 'Studio'),
        ('bungalow', 'Bungalow'),
        # Land
        ('residential_land', 'Residential Land'),
        ('commercial_land', 'Commercial Land'),
        ('agricultural_land', 'Agricultural Land'),
        ('industrial_land', 'Industrial Land'),
        ('mixed_use_land', 'Mixed-Use Land'),
        # Furniture
        ('living_room', 'Living Room Furniture'),
        ('bedroom', 'Bedroom Furniture'),
        ('kitchen', 'Kitchen Furniture'),
        ('office', 'Office Furniture'),
        ('outdoor', 'Outdoor Furniture'),
        ('storage', 'Storage Furniture'),
    )
    
    CONDITION_CHOICES = (
        ('new', 'New'),
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('needs_renovation', 'Needs Renovation'),
    )
    
    # Basic fields
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='posts/')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    
    # Property/Product fields
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES, default='furniture')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='living_room')
    inventory = models.IntegerField(default=1, help_text="Number of items available")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good', 
                                 help_text="Condition of the property/item")
    
    # Real Estate Specific Fields
    size_sqm = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                   help_text="Size in square meters")
    bedrooms = models.IntegerField(null=True, blank=True, help_text="Number of bedrooms (for houses)")
    bathrooms = models.IntegerField(null=True, blank=True, help_text="Number of bathrooms (for houses)")
    parking_spaces = models.IntegerField(null=True, blank=True, default=0, help_text="Number of parking spaces")
    year_built = models.IntegerField(null=True, blank=True, help_text="Year property was built")
    is_furnished = models.BooleanField(default=False, help_text="Is the property furnished? (for houses)")
    
    # Location fields
    location_address = models.CharField(max_length=500, blank=True, null=True, help_text="Full address")
    location_district = models.CharField(max_length=100, blank=True, null=True, help_text="District/Region")
    location_city = models.CharField(max_length=100, blank=True, null=True, help_text="City")
    location_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Stats
    total_purchases = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0, help_text="Number of times listing was viewed")
    inquiry_count = models.IntegerField(default=0, help_text="Number of inquiries received")
    
    # Listing status
    is_active = models.BooleanField(default=True, help_text="Is listing currently active?")
    is_sold = models.BooleanField(default=False, help_text="Has the property been sold?")
    
    def __str__(self):
        return self.title
        
    def total_likes(self):
        return self.likes.count()
    
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return reviews.aggregate(models.Avg('rating'))['rating__avg']
        return 0
    
    def review_count(self):
        return self.reviews.count()
    
    def is_sold_out(self):
        return self.inventory <= 0 or self.is_sold
    
    def is_house(self):
        return self.property_type == 'house'
    
    def is_land(self):
        return self.property_type == 'land'
    
    def is_furniture(self):
        return self.property_type == 'furniture'
    
    def get_display_size(self):
        """Return formatted size with unit"""
        if self.size_sqm:
            return f"{self.size_sqm} sqm"
        return "N/A"
    
    def get_property_details(self):
        """Return key property details based on type"""
        details = []
        if self.is_house():
            if self.bedrooms:
                details.append(f"{self.bedrooms} Bed")
            if self.bathrooms:
                details.append(f"{self.bathrooms} Bath")
            if self.size_sqm:
                details.append(f"{self.size_sqm} sqm")
        elif self.is_land():
            if self.size_sqm:
                details.append(f"{self.size_sqm} sqm")
        return " | ".join(details) if details else "Details not specified"
    
    class Meta:
        ordering = ['-created_at']

class ListingFee(models.Model):
    """
    Daily listing fee model based on property value.
    Vendors pay a daily fee to keep their listings active.
    """
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    )
    
    listing = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='listing_fees')
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listing_fees')
    
    # Fee calculation
    daily_fee = models.DecimalField(max_digits=10, decimal_places=2, 
                                    help_text="Daily fee to keep listing active")
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True, help_text="When listing fee period ends")
    days_paid = models.IntegerField(default=0, help_text="Number of days paid for")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Payment tracking
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    
    # Paypack Payment tracking (reusing momo fields for backward compatibility)
    payment_method = models.CharField(max_length=20, default='manual', 
                                      help_text="Payment method: manual, paypack")
    momo_transaction_id = models.CharField(max_length=100, blank=True, null=True,
                                          help_text="Paypack transaction reference ID (reusing field name)")
    momo_status = models.CharField(max_length=50, blank=True, null=True,
                                   help_text="Paypack payment status: PENDING, SUCCESSFUL, FAILED (reusing field name)")
    momo_status_checked_at = models.DateTimeField(null=True, blank=True)
    
    # Auto-renewal
    auto_renew = models.BooleanField(default=False, help_text="Automatically renew listing")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def calculate_daily_fee(self):
        """
        Calculate daily fee based on property value.
        Fee structure example:
        - Under 1M: 100 RWF/day
        - 1M-5M: 200 RWF/day
        - 5M-10M: 500 RWF/day
        - Over 10M: 1000 RWF/day
        """
        from decimal import Decimal
        price = self.listing.price
        
        if price < Decimal('1000000'):
            return Decimal('100.00')
        elif price < Decimal('5000000'):
            return Decimal('200.00')
        elif price < Decimal('10000000'):
            return Decimal('500.00')
        else:
            return Decimal('1000.00')
    
    def is_active(self):
        """Check if listing fee period is still active"""
        if not self.end_date:
            return False
        return timezone.now().date() <= self.end_date and self.payment_status == 'paid'
    
    def days_remaining(self):
        """Calculate days remaining in paid period"""
        if not self.end_date:
            return 0
        delta = self.end_date - timezone.now().date()
        return max(0, delta.days)
    
    def save(self, *args, **kwargs):
        # Auto-calculate daily fee if not set
        if not self.daily_fee:
            self.daily_fee = self.calculate_daily_fee()
        
        # Calculate total amount
        if self.days_paid > 0:
            self.total_amount = self.daily_fee * self.days_paid
        
        # Calculate end date based on days paid
        if self.days_paid > 0 and not self.end_date:
            from datetime import timedelta
            self.end_date = self.start_date + timedelta(days=self.days_paid)
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Listing Fee for {self.listing.title} - {self.vendor.username}"
    
    class Meta:
        ordering = ['-created_at']

class ProductReview(models.Model):
    product = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['product', 'reviewer']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.reviewer.username} - {self.product.title} - {self.rating} stars"

class PropertyInquiry(models.Model):
    """
    Model for property inquiries and contact requests.
    Buyers can inquire about properties before making purchases.
    """
    STATUS_CHOICES = (
        ('new', 'New Inquiry'),
        ('contacted', 'Vendor Contacted'),
        ('viewing_scheduled', 'Viewing Scheduled'),
        ('offer_made', 'Offer Made'),
        ('negotiating', 'Negotiating'),
        ('accepted', 'Accepted'),
        ('completed', 'Sale Completed'),
        ('declined', 'Declined'),
        ('cancelled', 'Cancelled'),
    )
    
    inquiry_id = models.CharField(max_length=50, unique=True, blank=True)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries')
    property = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='inquiries')
    
    # Inquiry details
    message = models.TextField(help_text="Buyer's message or questions")
    phone_contact = models.CharField(max_length=15, blank=True, null=True, help_text="Buyer's contact phone")
    email_contact = models.EmailField(blank=True, null=True, help_text="Buyer's contact email")
    
    # Status and negotiation
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='new')
    offered_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True,
                                       help_text="Price offered by buyer")
    
    # Viewing details
    preferred_viewing_date = models.DateTimeField(null=True, blank=True, 
                                                  help_text="Preferred date to view property")
    viewing_confirmed = models.BooleanField(default=False)
    viewing_completed = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    responded_at = models.DateTimeField(null=True, blank=True, help_text="When vendor responded")
    
    # Notes
    vendor_notes = models.TextField(blank=True, null=True, help_text="Vendor's notes about this inquiry")
    
    def save(self, *args, **kwargs):
        if not self.inquiry_id:
            # Generate a unique inquiry ID
            self.inquiry_id = f"INQ-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.buyer.username} - {self.property.title} - {self.inquiry_id}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Property Inquiries"

class Purchase(models.Model):
    """
    Model for completed purchases/sales.
    Created after inquiry is accepted and payment is confirmed.
    """
    STATUS_CHOICES = (
        ('pending_payment', 'Pending Payment'),
        ('payment_confirmed', 'Payment Confirmed'),
        ('documents_processing', 'Documents Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('paypack', 'Paypack'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('other', 'Other'),
    )
    
    order_id = models.CharField(max_length=50, unique=True, blank=True)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    property = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='purchases', 
                                 null=True, blank=True, help_text="Property being purchased")
    inquiry = models.ForeignKey(PropertyInquiry, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='purchases', help_text="Related inquiry if any")
    
    # Purchase details
    quantity = models.IntegerField(default=1, help_text="Quantity (usually 1 for property)")
    final_price = models.DecimalField(max_digits=12, decimal_places=2, default=0,
                                      help_text="Final agreed price")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='paypack')
    payment_reference = models.CharField(max_length=100, blank=True, null=True, 
                                        help_text="Payment transaction reference")
    
    # Status tracking
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_payment')
    
    # Delivery tracking (for furniture items)
    DELIVERY_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('delivery_failed', 'Delivery Failed'),
    )
    
    delivery_status = models.CharField(
        max_length=30, 
        choices=DELIVERY_STATUS_CHOICES, 
        null=True, 
        blank=True,
        help_text="Delivery status (for furniture items)"
    )
    delivery_address = models.CharField(
        max_length=500, 
        blank=True, 
        null=True, 
        help_text="Delivery address for furniture items"
    )
    delivery_phone = models.CharField(
        max_length=15, 
        blank=True, 
        null=True, 
        help_text="Contact phone for delivery"
    )
    tracking_number = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        help_text="Tracking number for shipment"
    )
    shipped_at = models.DateTimeField(
        null=True, 
        blank=True, 
        help_text="When item was shipped"
    )
    delivered_at = models.DateTimeField(
        null=True, 
        blank=True, 
        help_text="When item was delivered"
    )
    delivery_notes = models.TextField(
        blank=True, 
        null=True, 
        help_text="Notes about delivery"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Documents and notes
    transaction_notes = models.TextField(blank=True, null=True, help_text="Transaction notes")
    documents_uploaded = models.BooleanField(default=False, help_text="Required documents uploaded")
    
    def save(self, *args, **kwargs):
        if not self.order_id:
            # Generate a unique order ID
            self.order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # For furniture items, initialize delivery status
        if self.property and self.property.is_furniture() and not self.delivery_status:
            if self.status == 'payment_confirmed':
                self.delivery_status = 'pending'
            elif self.status == 'completed':
                self.delivery_status = 'delivered'
        
        # Mark property as sold when purchase is completed (for non-furniture)
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
            # For furniture, inventory is already updated during checkout/creation
            # Only mark as sold if inventory reaches 0, but don't deduct again
            if self.property.is_furniture():
                # Check if inventory is already 0 or less, then mark as sold
                if self.property.inventory <= 0:
                    self.property.is_sold = True
                    self.property.save()
            else:
                # For non-furniture items, mark as sold and inactive
                self.property.is_sold = True
                self.property.is_active = False
                self.property.save()
        
        super().save(*args, **kwargs)
    
    def is_furniture_purchase(self):
        """Check if this purchase is for a furniture item"""
        return self.property and self.property.is_furniture()
    
    def __str__(self):
        return f"{self.buyer.username} - {self.property.title} - {self.order_id}"
    
    class Meta:
        ordering = ['-created_at']

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.post.title}"
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'post']

class Cart(models.Model):
    """
    Shopping cart model for users.
    Each user has one cart that holds multiple cart items.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart for {self.user.username}"
    
    def get_total_price(self):
        """Calculate total price of all items in cart"""
        return sum(item.get_total_price() for item in self.items.all())
    
    def get_total_items(self):
        """Get total number of items in cart"""
        return sum(item.quantity for item in self.items.all())
    
    def clear(self):
        """Remove all items from cart"""
        self.items.all().delete()
    
    class Meta:
        ordering = ['-updated_at']

class CartItem(models.Model):
    """
    Individual item in a shopping cart.
    Only furniture items can be added to cart.
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.quantity}x {self.product.title} in {self.cart.user.username}'s cart"
    
    def get_total_price(self):
        """Calculate total price for this cart item"""
        return self.product.price * self.quantity
    
    def save(self, *args, **kwargs):
        # Ensure only furniture items can be added to cart
        if not self.product.is_furniture():
            raise ValueError("Only furniture items can be added to cart")
        
        # Check inventory
        if self.quantity > self.product.inventory:
            raise ValueError(f"Quantity exceeds available inventory ({self.product.inventory})")
        
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['cart', 'product']

class ProductImage(models.Model):
    product = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='auxiliary_images')
    image = models.ImageField(upload_to='product_gallery/')
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.product.title} - Image {self.display_order + 1}"
    
    class Meta:
        ordering = ['display_order']

class UserQRCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='qr_code')
    qr_data = models.TextField()  # JWT token or encrypted data
    qr_image = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"QR Code for {self.user.username}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at

class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_verifications')
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=50, default='purchase_confirmation')  # purchase_confirmation, general
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"OTP for {self.user.username} - {self.purpose}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Set expiration to 10 minutes from creation
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)


# ==============================================
# CHAT MODELS - Real-time messaging between buyers and sellers
# ==============================================

class Conversation(models.Model):
    """
    Model for chat conversations between buyers and sellers.
    Each conversation is linked to a specific property and optionally an inquiry.
    """
    # Unique conversation identifier
    conversation_id = models.CharField(max_length=50, unique=True, blank=True)
    
    # Participants
    buyer = models.ForeignKey(
        User, on_delete=models.CASCADE, 
        related_name='buyer_conversations',
        help_text="The user initiating the conversation (potential buyer)"
    )
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, 
        related_name='seller_conversations',
        help_text="The property owner/vendor"
    )
    
    # Related property (optional - for context)
    property = models.ForeignKey(
        Post, on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='conversations',
        help_text="The property this conversation is about"
    )
    
    # Related inquiry (optional - if conversation started from an inquiry)
    inquiry = models.ForeignKey(
        PropertyInquiry, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='conversations',
        help_text="Related property inquiry if any"
    )
    
    # Conversation status
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('archived', 'Archived'),
        ('blocked', 'Blocked'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(null=True, blank=True)
    
    # Read tracking
    buyer_last_read = models.DateTimeField(null=True, blank=True)
    seller_last_read = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.conversation_id:
            # Generate a unique conversation ID
            self.conversation_id = f"CONV-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        property_title = self.property.title if self.property else "General"
        return f"Chat: {self.buyer.username} ↔ {self.seller.username} ({property_title})"
    
    def get_other_participant(self, user):
        """Get the other participant in the conversation."""
        if user == self.buyer:
            return self.seller
        return self.buyer
    
    def get_unread_count(self, user):
        """Get count of unread messages for a user."""
        if user == self.buyer:
            last_read = self.buyer_last_read
        else:
            last_read = self.seller_last_read
        
        if not last_read:
            return self.messages.exclude(sender=user).count()
        
        return self.messages.exclude(sender=user).filter(created_at__gt=last_read).count()
    
    def mark_as_read(self, user):
        """Mark all messages as read for a user."""
        now = timezone.now()
        if user == self.buyer:
            self.buyer_last_read = now
        else:
            self.seller_last_read = now
        self.save(update_fields=['buyer_last_read' if user == self.buyer else 'seller_last_read'])
        
        # Also update individual message read status
        self.messages.exclude(sender=user).filter(is_read=False).update(
            is_read=True,
            read_at=now
        )
    
    def get_last_message(self):
        """Get the most recent message in the conversation."""
        return self.messages.order_by('-created_at').first()
    
    class Meta:
        ordering = ['-last_message_at', '-created_at']
        # Ensure unique conversation between buyer and seller for a specific property
        unique_together = ['buyer', 'seller', 'property']


class Message(models.Model):
    """
    Model for individual chat messages.
    """
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    
    # Message content
    content = models.TextField(help_text="Message text content")
    
    # Optional: attachment support for future
    attachment = models.FileField(
        upload_to='chat_attachments/', 
        blank=True, null=True,
        help_text="Optional file attachment"
    )
    attachment_type = models.CharField(
        max_length=20, blank=True, null=True,
        help_text="Type of attachment: image, document, etc."
    )
    
    # Message status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Soft delete (for message deletion without losing history)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"{self.sender.username}: {preview}"
    
    def mark_as_read(self):
        """Mark this message as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def soft_delete(self):
        """Soft delete the message."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])
    
    def get_display_content(self):
        """Return content or deletion placeholder."""
        if self.is_deleted:
            return "This message was deleted"
        return self.content
    
    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sender', 'created_at']),
        ]
