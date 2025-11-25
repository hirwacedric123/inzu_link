from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Post, ProductReview, PropertyInquiry, ListingFee

class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    phone_number = forms.CharField(required=True, max_length=15)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2']
    
    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        # Add Bootstrap classes to form fields
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
        
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.phone_number = self.cleaned_data['phone_number']
        user.role = 'user'  # Setting the default role to 'user'
        
        if commit:
            user.save()
        return user

class ProductReviewForm(forms.ModelForm):
    rating = forms.ChoiceField(
        choices=[(i, i) for i in range(1, 6)],
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    comment = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Write your review...'}),
        required=False
    )
    
    class Meta:
        model = ProductReview
        fields = ['rating', 'comment']

class PropertyListingForm(forms.ModelForm):
    """Form for creating/editing property listings"""
    
    class Meta:
        model = Post
        fields = [
            'title', 'description', 'property_type', 'category', 'price',
            'condition', 'image', 'size_sqm', 'bedrooms', 'bathrooms',
            'parking_spaces', 'year_built', 'is_furnished', 'inventory',
            'location_address', 'location_district', 'location_city',
            'location_latitude', 'location_longitude'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Luxury 3BR Villa in Kigali'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 5,
                'placeholder': 'Detailed description of the property...'
            }),
            'property_type': forms.Select(attrs={'class': 'form-control', 'id': 'property_type'}),
            'category': forms.Select(attrs={'class': 'form-control', 'id': 'category'}),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter price in RWF',
                'step': '0.01'
            }),
            'condition': forms.Select(attrs={'class': 'form-control'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'size_sqm': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Size in square meters',
                'step': '0.01'
            }),
            'bedrooms': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Number of bedrooms'
            }),
            'bathrooms': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Number of bathrooms'
            }),
            'parking_spaces': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Number of parking spaces'
            }),
            'year_built': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Year built (e.g., 2020)'
            }),
            'is_furnished': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'inventory': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Quantity available'
            }),
            'location_address': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Full address'
            }),
            'location_district': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'District/Region'
            }),
            'location_city': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'City'
            }),
            'location_latitude': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Latitude (optional)',
                'step': '0.000001'
            }),
            'location_longitude': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Longitude (optional)',
                'step': '0.000001'
            }),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        property_type = cleaned_data.get('property_type')
        category = cleaned_data.get('category')
        
        # Validate category matches property type
        house_categories = ['apartment', 'villa', 'townhouse', 'duplex', 'studio', 'bungalow']
        land_categories = ['residential_land', 'commercial_land', 'agricultural_land', 'industrial_land', 'mixed_use_land']
        furniture_categories = ['living_room', 'bedroom', 'kitchen', 'office', 'outdoor', 'storage']
        
        if property_type == 'house' and category not in house_categories:
            raise forms.ValidationError("Please select a valid house category.")
        elif property_type == 'land' and category not in land_categories:
            raise forms.ValidationError("Please select a valid land category.")
        elif property_type == 'furniture' and category not in furniture_categories:
            raise forms.ValidationError("Please select a valid furniture category.")
        
        return cleaned_data

class PropertyInquiryForm(forms.ModelForm):
    """Form for buyers to inquire about properties"""
    
    class Meta:
        model = PropertyInquiry
        fields = [
            'message', 'phone_contact', 'email_contact',
            'preferred_viewing_date', 'offered_price'
        ]
        widgets = {
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Your message or questions about this property...',
                'required': True
            }),
            'phone_contact': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your contact phone number'
            }),
            'email_contact': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your email address'
            }),
            'preferred_viewing_date': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local',
                'placeholder': 'When would you like to view this property?'
            }),
            'offered_price': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your offer price (optional)',
                'step': '0.01'
            }),
        }

class ListingFeePaymentForm(forms.ModelForm):
    """Form for vendors to pay listing fees"""
    
    class Meta:
        model = ListingFee
        fields = ['days_paid', 'payment_reference', 'auto_renew']
        widgets = {
            'days_paid': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Number of days (e.g., 7, 30)',
                'min': '1',
                'required': True
            }),
            'payment_reference': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Payment reference/transaction ID'
            }),
            'auto_renew': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        self.listing = kwargs.pop('listing', None)
        super().__init__(*args, **kwargs)
        
        # Add help text showing fee calculation
        if self.listing:
            from decimal import Decimal
            daily_fee = Decimal('100.00')  # Default
            price = self.listing.price
            
            if price < Decimal('1000000'):
                daily_fee = Decimal('100.00')
            elif price < Decimal('5000000'):
                daily_fee = Decimal('200.00')
            elif price < Decimal('10000000'):
                daily_fee = Decimal('500.00')
            else:
                daily_fee = Decimal('1000.00')
            
            self.fields['days_paid'].help_text = f"Daily fee: {daily_fee} RWF/day"