# Quick Test Guide - Real Estate Platform

**Platform**: InzuLink Real Estate & Furniture Marketplace  
**Date**: November 25, 2025

---

## 🚀 Getting Started

### 1. Apply Database Migration
```bash
cd /mnt/data/KoraQuest-main
source cedenv/bin/activate
python3 manage.py migrate authentication
```

### 2. Start Development Server
```bash
python3 manage.py runserver
```

### 3. Access the Platform
Open browser: `http://127.0.0.1:8000/`

---

## 🧪 Testing Workflow

### **A. User Registration & Login**
1. ✅ Register new account: `/auth/register/`
2. ✅ Login: `/auth/login/`
3. ✅ Access dashboard: `/auth/dashboard/`

### **B. Browse Properties**
1. ✅ View property listings on dashboard
2. ✅ Filter by category (Houses, Land, Furniture)
3. ✅ Search for properties
4. ✅ Click on a property to view details

### **C. Vendor Flow** (Sell Properties)
1. ✅ Click "List Your Property"
2. ✅ Fill property details form
   - Property type (House/Land/Furniture)
   - Price, location, specifications
   - Upload images
3. ✅ Submit listing
4. ✅ Redirected to pay listing fee
5. ✅ Pay listing fee to activate property
6. ✅ View property in vendor dashboard
7. ✅ Manage incoming inquiries

### **D. Buyer Flow** (Find Properties)
1. ✅ Browse properties on dashboard
2. ✅ Click on a property
3. ✅ Click "Send Inquiry" button
4. ✅ Fill inquiry form:
   - Message to seller
   - Contact information
   - Offered price (optional)
   - Preferred viewing date
5. ✅ Submit inquiry
6. ✅ Track inquiry status in "My Inquiries"
7. ✅ Arrange property viewing with seller
8. ✅ Complete purchase after viewing

### **E. Inquiry Management**
**For Buyers:**
- View sent inquiries: `/auth/my-inquiries/`
- Track status: Pending, Accepted, Viewing Scheduled, etc.

**For Sellers:**
- View received inquiries: `/auth/received-inquiries/`
- Respond to inquiries
- Schedule viewings
- Mark as completed when sold

### **F. Vendor Dashboard**
- `/auth/vendor-dashboard/`
- ✅ View statistics (listings, sales, inquiries)
- ✅ Manage property listings
- ✅ View listing fees
- ✅ Track recent sales
- ✅ Respond to inquiries

### **G. Listing Fee Management**
- View fees: `/auth/my-listing-fees/`
- Pay fee: `/auth/pay-listing-fee/<property_id>/`
- ✅ Properties inactive until fee paid
- ✅ Alert shows for inactive properties

### **H. Sales Statistics** (Fixed!)
- `/auth/sales-statistics/`
- ✅ Should now load without errors
- ✅ View property sales breakdown
- ✅ Export to CSV/PDF

---

## 🎯 Key Pages to Test

### Public Pages:
- [x] Home: `/`
- [x] Register: `/auth/register/`
- [x] Login: `/auth/login/`

### User Pages:
- [x] Dashboard (Browse): `/auth/dashboard/`
- [x] Property Detail: `/auth/post/<id>/`
- [x] My Inquiries: `/auth/my-inquiries/`
- [x] Purchase History: `/auth/purchases/`
- [x] Profile Settings: `/auth/settings/`
- [x] My QR Code: `/auth/my-qr-code/`

### Vendor Pages:
- [x] Vendor Dashboard: `/auth/vendor-dashboard/`
- [x] Create Property: `/auth/create-product/`
- [x] Edit Property: `/auth/edit-product/<id>/`
- [x] Received Inquiries: `/auth/received-inquiries/`
- [x] Inquiry Detail: `/auth/inquiry/<id>/`
- [x] My Listing Fees: `/auth/my-listing-fees/`
- [x] Pay Listing Fee: `/auth/pay-listing-fee/<id>/`
- [x] Sales Statistics: `/auth/sales-statistics/`

### Admin/Staff Pages:
- [x] Django Admin: `/admin/`
- [x] InzuLink Dashboard: `/auth/koraquest-dashboard/`
- [x] Vendor Statistics: `/auth/vendor-statistics/`

---

## 🔍 What to Look For

### Property Listings:
✅ Property type badges (House/Land/Furniture)  
✅ Location information displayed  
✅ Specifications (bedrooms, bathrooms, size)  
✅ Price in RWF  
✅ Status indicators (Active/Inactive/Sold)  
✅ "Send Inquiry" button (not "Buy Now")  

### Inquiry System:
✅ Inquiry form modal on property detail page  
✅ Contact information fields  
✅ Offered price input  
✅ Viewing date picker  
✅ Inquiry status tracking  

### Listing Fees:
✅ Warning alert for inactive properties  
✅ Pay fee button for inactive listings  
✅ Fee calculation based on property value  
✅ Property activates after fee payment  

### Dashboards:
✅ Real estate terminology (not e-commerce)  
✅ Property-specific statistics  
✅ Inquiry counts displayed  
✅ No commission references  
✅ Listing fee information  

---

## ⚠️ Common Issues & Solutions

### Issue 1: Migration Error
**Error**: "No migrations to apply"
**Solution**: Already migrated, proceed to testing

### Issue 2: Static Files Not Loading
**Error**: 404 on CSS/JS files
**Solution**: 
```bash
python3 manage.py collectstatic --noinput
```

### Issue 3: Images Not Displaying
**Error**: Broken image icons
**Solution**: Ensure MEDIA_URL and MEDIA_ROOT configured in settings.py

### Issue 4: Permission Denied
**Error**: "You don't have permission"
**Solution**: Login as correct user role (vendor for listing, admin for stats)

---

## 📊 Expected Data Flow

```
1. VENDOR CREATES PROPERTY
   ↓
2. REDIRECT TO PAY LISTING FEE
   ↓
3. PROPERTY BECOMES ACTIVE
   ↓
4. BUYER BROWSES & FINDS PROPERTY
   ↓
5. BUYER SENDS INQUIRY
   ↓
6. VENDOR RECEIVES INQUIRY
   ↓
7. VENDOR & BUYER COMMUNICATE
   ↓
8. VIEWING SCHEDULED
   ↓
9. PROPERTY VISIT
   ↓
10. PURCHASE COMPLETED
    ↓
11. PROPERTY MARKED AS SOLD
```

---

## 🎨 UI/UX Checks

### Homepage:
- ✅ "Find Your Dream Home, Land & Furniture"
- ✅ "List Your Property" button
- ✅ Real estate hero section
- ✅ Property statistics

### Dashboard:
- ✅ Property cards with images
- ✅ Category filters (Houses, Land, Furniture)
- ✅ Location displayed
- ✅ Property specifications visible

### Property Detail:
- ✅ Large property images
- ✅ Detailed specifications
- ✅ Location map (if coordinates provided)
- ✅ Seller information
- ✅ Inquiry form modal

### Vendor Dashboard:
- ✅ Property management table
- ✅ Listing fee alerts
- ✅ Inquiry notifications
- ✅ Sales statistics
- ✅ Action buttons (View, Edit, Pay Fee)

---

## ✅ Success Criteria

Your transformation is successful if:

1. ✅ No more "Cannot resolve keyword 'product'" errors
2. ✅ Properties display with correct information
3. ✅ Inquiry system works (send & receive)
4. ✅ Listing fees can be paid
5. ✅ Properties activate after fee payment
6. ✅ Vendor dashboard shows properties correctly
7. ✅ Sales statistics page loads
8. ✅ All terminology reflects real estate context
9. ✅ No references to "products" or "commission"
10. ✅ Property-specific fields display correctly

---

## 🎉 Final Checklist

Before considering the transformation complete:

- [ ] Database migration applied successfully
- [ ] Server starts without errors
- [ ] Can register new user
- [ ] Can create property listing
- [ ] Can pay listing fee
- [ ] Property shows as active after fee payment
- [ ] Can send inquiry on a property
- [ ] Vendor can view received inquiries
- [ ] Buyer can view sent inquiries
- [ ] Sales statistics page loads
- [ ] Vendor dashboard displays correctly
- [ ] All pages use "property" not "product"
- [ ] No console errors in browser
- [ ] Images upload and display correctly
- [ ] Forms validate properly

---

## 📞 Need Help?

If you encounter issues:

1. **Check Django Logs**: Look at terminal output for errors
2. **Check Browser Console**: Press F12 for JavaScript errors
3. **Check Database**: Verify migration applied
4. **Check Files**: Ensure all files saved correctly
5. **Restart Server**: Sometimes helps with cached changes

---

## 🎊 You're Ready!

The platform has been fully transformed from a general marketplace to a specialized **Real Estate & Furniture Platform**. All systems have been updated to reflect the new business model with inquiry-based transactions and listing fees.

**Happy Testing!** 🏡🪑🌳

---

*Created: November 25, 2025*  
*Platform: InzuLink v2.0*  
*Mode: Real Estate & Furniture Marketplace*

