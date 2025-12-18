# KoraQuest/InzuLink - E-Commerce Documentation

## Overview

**KoraQuest** (also known as **InzuLink**) is a specialized e-commerce platform focused on real estate and furniture marketplace transactions. This documentation outlines the e-commerce type, business model, and target customer characteristics.

**Platform URL**: https://inzulink.bonasolutions.tech  
**Status**: Production-Ready  
**Market Focus**: Rwanda (RWF currency)

---

## 1. E-Commerce Type

### 1.1 Primary E-Commerce Model

**Type**: **B2C Marketplace with C2C Elements** (Business-to-Consumer Marketplace with Consumer-to-Consumer capabilities)

**Classification**: **Hybrid Marketplace Platform**

#### Characteristics:

1. **Multi-Vendor Marketplace**
   - Multiple vendors can list products on the platform
   - Platform acts as intermediary between buyers and sellers
   - Centralized payment processing
   - Platform manages transactions and commissions

2. **Real Estate & Furniture Focus**
   - Specialized product categories:
     - **Houses**: Apartments, Villas, Townhouses, Duplexes, Studios, Bungalows
     - **Land Plots**: Residential, Commercial, Agricultural, Industrial, Mixed-Use
     - **Furniture**: Living Room, Bedroom, Kitchen, Office, Outdoor, Storage

3. **Dual Transaction Models**
   - **Direct Purchase** (Furniture): Standard e-commerce checkout flow
   - **Inquiry-Based** (Real Estate): Contact seller → View property → Negotiate → Purchase

### 1.2 E-Commerce Sub-Types

#### A. **Marketplace E-Commerce**
- Platform connects multiple sellers with multiple buyers
- Platform earns revenue through listing fees and commissions
- No inventory ownership by platform
- Platform provides infrastructure (payment, verification, communication)

#### B. **Real Estate E-Commerce**
- Property listings with detailed information
- Inquiry-based workflow (not instant purchase)
- Property viewing scheduling
- Document processing and verification
- Price negotiation support

#### C. **Furniture E-Commerce**
- Standard product catalog
- Shopping cart functionality
- Direct purchase workflow
- Inventory management
- Delivery tracking

### 1.3 Platform Role

**Platform Type**: **Intermediary Marketplace**

The platform serves as a trusted intermediary that:
- Facilitates transactions between buyers and sellers
- Provides payment processing
- Offers verification and security services
- Manages communication channels
- Handles logistics (for furniture items)
- Ensures transaction security through QR codes and OTP verification

---

## 2. Business Model

### 2.1 Revenue Streams

#### Primary Revenue Model: **Daily Listing Fee System**

**Fee Structure:**
- Vendors pay a daily fee to keep their listings active
- Fee is calculated based on property value:
  - **Under 1M RWF**: 100 RWF/day
  - **1M - 5M RWF**: 200 RWF/day
  - **5M - 10M RWF**: 500 RWF/day
  - **Over 10M RWF**: 1000 RWF/day

**Advantages:**
- Predictable revenue stream
- Low barrier to entry for vendors
- No commission on sales (vendor-friendly)
- Encourages active listings
- Scalable pricing model

#### Secondary Revenue Model: **Commission-Based (Legacy)**

**Commission Structure:**
- **80/20 Split**: 80% to vendor, 20% to platform
- Applied to completed transactions
- Automatic calculation and distribution
- Delivery fee allocation

**Note**: Currently transitioning to daily listing fee model for real estate, while maintaining commission model for furniture items.

### 2.2 Value Proposition

#### For Buyers:
- **Trust & Security**: Platform acts as intermediary, reducing fraud risk
- **Verification System**: QR code + OTP verification for secure transactions
- **Wide Selection**: Multiple vendors and product categories
- **Easy Discovery**: Advanced search and filtering
- **Secure Payments**: Integrated payment gateway (Paypack/Mobile Money)
- **Communication**: Real-time chat with sellers
- **Transparency**: Reviews and ratings system

#### For Vendors:
- **Low Entry Barrier**: Affordable daily listing fees
- **No Sales Commission**: Keep 100% of sale price (with listing fee model)
- **Reach**: Access to platform's buyer base
- **Easy Management**: Vendor dashboard for product and sales management
- **Analytics**: Sales statistics and reports
- **Marketing**: Product visibility through platform
- **Payment Processing**: Automated payment handling

#### For Platform (InzuLink):
- **Recurring Revenue**: Daily listing fees provide steady income
- **Scalability**: Revenue grows with number of active listings
- **Low Operational Cost**: Platform doesn't hold inventory
- **Network Effects**: More vendors attract more buyers, and vice versa

### 2.3 Business Model Canvas

#### Key Partners
- **Payment Gateway**: Paypack (Mobile Money integration)
- **Hosting Provider**: Render.com (cloud infrastructure)
- **Database Provider**: PostgreSQL (via Render)
- **Redis Provider**: Redis (for real-time features)

#### Key Activities
- Platform maintenance and development
- Vendor onboarding and support
- Transaction processing and verification
- Customer service
- Marketing and user acquisition

#### Key Resources
- Technology platform (Django-based)
- Payment processing infrastructure
- QR code verification system
- Real-time chat system
- Vendor and buyer user base

#### Cost Structure
- **Fixed Costs**:
  - Hosting and infrastructure (Render.com)
  - Domain and SSL certificates
  - Development and maintenance
- **Variable Costs**:
  - Payment gateway fees
  - Customer support
  - Marketing and advertising

#### Revenue Streams
1. **Daily Listing Fees** (Primary)
2. **Transaction Commissions** (Secondary, for furniture)
3. **Premium Features** (Future: Featured listings, advertising)

### 2.4 Unique Selling Points (USP)

1. **Intermediary Model**: Platform acts as trusted middleman, reducing fraud
2. **Specialized Focus**: Real estate and furniture marketplace (not general e-commerce)
3. **Daily Fee Model**: Affordable, predictable pricing for vendors
4. **Verification System**: QR code + OTP for secure transactions
5. **Real-Time Communication**: Built-in chat system for buyer-seller communication
6. **Rwanda-Focused**: Localized for Rwandan market (RWF currency, Mobile Money)

---

## 3. Target Customer Characteristics

### 3.1 Buyer Personas

#### Persona 1: **First-Time Home Buyer (Sarah)**

**Demographics:**
- Age: 28-35
- Location: Kigali, Rwanda
- Income: Middle to upper-middle class
- Occupation: Professional (IT, Finance, Healthcare)

**Characteristics:**
- Looking to purchase first property (apartment or house)
- Has savings but needs financing options
- Wants to view properties before purchasing
- Values security and trust in transactions
- Active on mobile devices
- Prefers online research before physical visits

**Needs:**
- Easy property search and filtering
- Detailed property information
- Ability to contact sellers directly
- Secure payment options
- Property viewing scheduling
- Trustworthy platform

**Pain Points:**
- Fear of fraud in online property transactions
- Difficulty finding reliable property listings
- Lack of transparency in pricing
- Limited property information online

**How Platform Addresses:**
- QR code + OTP verification for security
- Detailed property listings with photos and specifications
- Real-time chat for direct communication
- Transparent pricing and listing information
- Inquiry-based workflow allows property viewing

#### Persona 2: **Furniture Shopper (Jean)**

**Demographics:**
- Age: 25-45
- Location: Urban areas in Rwanda
- Income: Middle class
- Occupation: Various (Office workers, Small business owners)

**Characteristics:**
- Looking to furnish home or office
- Price-conscious but values quality
- Prefers convenient shopping (online)
- Wants quick delivery
- Uses mobile money for payments

**Needs:**
- Easy product browsing
- Price comparison
- Shopping cart functionality
- Secure checkout
- Delivery options
- Product reviews

**Pain Points:**
- Limited furniture options in local stores
- High prices in physical stores
- Difficulty finding specific items
- Concerns about product quality

**How Platform Addresses:**
- Wide selection of furniture categories
- Competitive pricing from multiple vendors
- Shopping cart for multiple items
- Mobile Money payment integration
- Product reviews and ratings
- Delivery tracking

#### Persona 3: **Land Investor (Paul)**

**Demographics:**
- Age: 35-55
- Location: Rwanda (various regions)
- Income: Upper-middle to upper class
- Occupation: Business owner, Investor

**Characteristics:**
- Looking for land for investment or development
- Has capital for large purchases
- Values detailed property information
- Wants to negotiate prices
- Needs legal documentation support

**Needs:**
- Advanced search (location, size, price range)
- Detailed land information (GPS coordinates, zoning)
- Direct communication with sellers
- Price negotiation tools
- Document verification
- Secure high-value transactions

**Pain Points:**
- Difficulty finding suitable land plots
- Lack of detailed information online
- Concerns about land title authenticity
- High-value transaction security

**How Platform Addresses:**
- Advanced filtering (location, size, type)
- GPS coordinates for land plots
- Inquiry workflow for negotiation
- QR code verification for transactions
- Platform intermediary for security

### 3.2 Vendor Personas

#### Persona 1: **Individual Property Seller (Marie)**

**Demographics:**
- Age: 40-60
- Location: Kigali and surrounding areas
- Background: Property owner selling inherited or owned property

**Characteristics:**
- First-time online seller
- Limited technical knowledge
- Wants to sell property quickly
- Values simplicity and ease of use
- Prefers low-cost listing options

**Needs:**
- Easy listing creation process
- Affordable listing fees
- Reach to potential buyers
- Help with pricing
- Support for inquiries

**Pain Points:**
- Difficulty reaching buyers
- High commission fees on other platforms
- Complex listing processes
- Limited marketing knowledge

**How Platform Addresses:**
- Simple listing form with guidance
- Low daily listing fees (no commission)
- Platform marketing and visibility
- Real-time chat for buyer communication
- Vendor dashboard for management

#### Persona 2: **Furniture Vendor (David)**

**Demographics:**
- Age: 30-50
- Location: Urban areas
- Background: Small business owner, furniture manufacturer or retailer

**Characteristics:**
- Multiple products to list
- Needs inventory management
- Wants to reach online customers
- Values sales analytics
- Needs efficient order processing

**Needs:**
- Bulk product management
- Inventory tracking
- Sales reports and analytics
- Order management
- Payment processing

**Pain Points:**
- Limited online presence
- Difficulty managing multiple listings
- Lack of sales insights
- Manual order processing

**How Platform Addresses:**
- Vendor dashboard for product management
- Inventory tracking system
- Sales statistics and reports
- Automated order processing
- Integrated payment system

#### Persona 3: **Real Estate Agent (Grace)**

**Demographics:**
- Age: 28-45
- Location: Kigali
- Background: Licensed real estate professional

**Characteristics:**
- Manages multiple property listings
- Needs professional tools
- Values lead generation
- Wants to track inquiries
- Needs efficient communication

**Needs:**
- Multiple listing management
- Inquiry tracking and management
- Professional presentation
- Lead generation
- Communication tools

**Pain Points:**
- Managing multiple platforms
- Difficulty tracking leads
- Limited professional tools
- Inefficient communication

**How Platform Addresses:**
- Vendor dashboard for multiple listings
- Inquiry management system
- Professional listing presentation
- Real-time chat for communication
- Analytics and reporting

### 3.3 Customer Segmentation

#### By Product Type:

**Real Estate Buyers:**
- **Primary**: First-time home buyers, property investors
- **Secondary**: Real estate developers, property flippers
- **Characteristics**: Higher purchase value, longer decision cycle, need for property viewing

**Furniture Buyers:**
- **Primary**: Homeowners, office managers, small business owners
- **Secondary**: Students, renters
- **Characteristics**: Lower purchase value, faster decision cycle, immediate delivery needs

#### By Purchase Frequency:

**One-Time Buyers:**
- Property purchasers (houses, land)
- Large furniture purchases
- Characteristics: High value, infrequent purchases

**Repeat Buyers:**
- Furniture shoppers
- Property investors (multiple properties)
- Characteristics: Lower value per transaction, more frequent purchases

#### By Technology Adoption:

**Tech-Savvy Users:**
- Age: 25-40
- Comfortable with online transactions
- Uses mobile apps and online platforms regularly
- Values convenience and speed

**Traditional Users:**
- Age: 40+
- Prefers phone calls and in-person meetings
- Needs guidance and support
- Values trust and security

**Platform Strategy**: Support both segments with multiple communication channels (online chat, phone contact fields, inquiry system)

### 3.4 Geographic Targeting

#### Primary Market: **Rwanda**

**Focus Areas:**
- **Kigali**: Capital city, highest concentration of buyers and sellers
- **Secondary Cities**: Butare, Gisenyi, Musanze
- **Rural Areas**: Agricultural land, rural properties

**Localization:**
- Currency: Rwandan Franc (RWF)
- Payment: Mobile Money (MTN MoMo, Paypack)
- Language: English (primary), Kinyarwanda (future), French (future)
- Legal: Rwanda property laws and regulations

#### Market Characteristics:
- Growing middle class
- Increasing internet penetration
- Mobile-first market (high smartphone usage)
- Trust in mobile money payments
- Real estate market growth

### 3.5 Customer Journey

#### Buyer Journey:

1. **Awareness**
   - Discovers platform through:
     - Online search
     - Social media
     - Word of mouth
     - Advertising

2. **Consideration**
   - Browses product listings
   - Uses search and filters
   - Views product details
   - Reads reviews

3. **Decision**
   - Compares options
   - Contacts seller (inquiry or chat)
   - Views property (for real estate)
   - Negotiates price

4. **Purchase**
   - Adds to cart (furniture) or creates inquiry (real estate)
   - Completes checkout
   - Makes payment
   - Receives confirmation

5. **Post-Purchase**
   - Receives product/property
   - Leaves review
   - Returns for future purchases

#### Vendor Journey:

1. **Onboarding**
   - Registers account
   - Upgrades to vendor role
   - Completes profile

2. **Listing**
   - Creates product/property listing
   - Pays daily listing fee
   - Listing goes live

3. **Management**
   - Receives inquiries/messages
   - Responds to buyers
   - Manages listings

4. **Transaction**
   - Negotiates with buyer
   - Completes sale
   - Receives payment

5. **Growth**
   - Reviews sales analytics
   - Optimizes listings
   - Expands inventory

---

## 4. Competitive Advantages

### 4.1 Market Differentiation

1. **Specialized Focus**: Real estate and furniture (not general marketplace)
2. **Intermediary Model**: Platform ensures transaction security
3. **Daily Fee Model**: Affordable for vendors, no sales commission
4. **Verification System**: QR code + OTP for secure transactions
5. **Local Focus**: Rwanda-specific features (RWF, Mobile Money)
6. **Real-Time Communication**: Built-in chat system

### 4.2 Customer Value

- **For Buyers**: Trust, security, wide selection, easy discovery
- **For Vendors**: Low cost, reach, easy management, analytics
- **For Platform**: Recurring revenue, scalability, network effects

---

## 5. Summary

### E-Commerce Type
**B2C Marketplace with C2C Elements** - Hybrid marketplace platform specializing in real estate and furniture

### Business Model
**Daily Listing Fee System** - Vendors pay daily fees based on property value, with optional commission model for furniture

### Target Customers

**Buyers:**
- First-time home buyers (28-35, middle class)
- Furniture shoppers (25-45, middle class)
- Land investors (35-55, upper-middle class)

**Vendors:**
- Individual property sellers (40-60, first-time sellers)
- Furniture vendors (30-50, small business owners)
- Real estate agents (28-45, professionals)

**Geographic Focus**: Rwanda (primarily Kigali, expanding to secondary cities)

**Key Characteristics**: Mobile-first, trust-focused, price-conscious, growing middle class

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Platform Status**: Production-Ready

