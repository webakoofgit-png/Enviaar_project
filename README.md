# ENVIAAR E-commerce Experience

PROJECT: ENVIAAR – Premium Jewellery E-commerce Website

Build a complete, production-quality, MULTI-PAGE jewellery e-commerce website for the brand “ENVIAAR” using React.

IMPORTANT:
This must NOT be a one-page website.
Create proper routes and individual pages.
All navigation links, buttons, CTAs, forms, filters, wishlist, cart, login popup, search and product interactions must work.

DESIGN DIRECTION

ENVIAAR should feel:
- Premium
- Elegant
- Feminine
- Sophisticated
- Minimal
- Modern
- Trustworthy
- Boutique-like

The client specifically DOES NOT want a dark theme.

Use a soft luxury light palette:
- Warm ivory / off-white background
- Soft beige / champagne
- Very subtle blush or nude tones
- Charcoal text
- Muted metallic gold accents only where appropriate

Avoid:
- Black-heavy layouts
- Dark luxury theme
- Excessive gradients
- Bright colors
- Generic AI-looking sections
- Overuse of gold
- Oversized rounded cards
- Typical SaaS UI
- Crowded Shopify-template appearance

REFERENCE

Take visual inspiration from:
https://www.cartier.com/en-fr/lechoeurdespierres

Do NOT copy Cartier.
Use the reference only for:
- whitespace
- editorial composition
- luxury typography
- large jewellery photography
- elegant transitions
- product presentation
- premium navigation
- visual storytelling

The actual shopping experience should have the familiarity and usability of a polished Shopify jewellery store, but the frontend must be custom React UI.

BRAND

Brand Name: ENVIAAR

Instagram:
https://www.instagram.com/enviaar

Create the UI in a way that ENVIAAR feels like an independent premium jewellery label, not a generic marketplace.

TYPOGRAPHY

Use a sophisticated editorial serif font for major headings and a clean modern sans-serif for:
- navigation
- product information
- buttons
- prices
- forms

Typography must have excellent spacing and hierarchy.

------------------------------------------------
WEBSITE STRUCTURE
------------------------------------------------

Create these routes:

/
Home

/shop
Shop All

/collections
Collections

/collections/earrings
Earrings

/collections/bracelets
Bracelets

/collections/necklaces
Necklaces & Pendant Sets

/collections/rings
Rings

/collections/kada
Kada

/collections/mangalsutra
Mangalsutra

/collections/mens
Men’s Jewellery

/collections/brooches
Brooches

/collections/baby
Baby Jewellery

/festive
Festive Collection

/new-arrivals
New Arrivals

/bestsellers
Bestsellers

/product/:slug
Product Detail

/about
Our Story

/contact
Contact

/wishlist
Wishlist

/cart
Shopping Cart

/checkout
Checkout

/account
Customer Account

/orders
My Orders

/order/:id
Order Details

/search
Search Results

Also create:
Privacy Policy
Terms & Conditions
Shipping Policy
Return / Exchange Policy
Care Guide

------------------------------------------------
HEADER
------------------------------------------------

Create a sophisticated sticky header.

Top announcement bar:
“Complimentary Shipping | Easy Shopping | Premium Jewellery”

Main header:
Left:
Menu / Collections

Center:
ENVIAAR logo

Right:
Search
Account
Wishlist
Shopping Bag

Desktop should have elegant mega-menu navigation.

Main menu:
NEW IN
SHOP
COLLECTIONS
FESTIVE
MEN
ABOUT
CONTACT

SHOP mega menu:

Earrings
- Studs
- Hoops
- Danglers

Necklaces
- Pendant Sets
- Pendant Chains
- Heavy Necklace Sets
- Festive Jewellery

Bracelets
Rings
Kada
Mangalsutra
Brooches
Men’s Jewellery
Baby Jewellery

Include a beautiful editorial jewellery image inside the mega menu.

Mobile:
Use a premium full-screen slide-out menu.

------------------------------------------------
HOME PAGE
------------------------------------------------

The homepage must feel editorial and luxurious, not like a normal product catalogue.

SECTION 1 – HERO

Full-width jewellery lifestyle/editorial photograph.

Minimal text overlay:

ENVIAAR

“Jewellery, Made to Stay With You.”

Supporting line:
Contemporary jewellery designed for everyday elegance and memorable occasions.

CTA 1:
SHOP NEW ARRIVALS

CTA 2:
EXPLORE COLLECTIONS

Keep the hero sophisticated and spacious.

Use subtle image zoom/parallax effect.

------------------------------------------------

SECTION 2 – SHOP BY CATEGORY

Editorial image-based category layout.

Categories:
Earrings
Necklaces
Bracelets
Rings
Mangalsutra
Men’s

Do NOT use six identical cards.

Create an asymmetric editorial grid with different image proportions.

Hover:
gentle image zoom
category title animation
“Explore” reveal

------------------------------------------------

SECTION 3 – NEW ARRIVALS

Title:
NEW ARRIVALS

Horizontal premium product showcase.

Product card:
Large image
Wishlist heart
Product name
Short material
Price
Available colors/finish if applicable

On hover:
show second product image.

Quick actions:
Quick View
Add to Bag

Do not permanently show too many buttons.

------------------------------------------------

SECTION 4 – BRAND STORY

Use a split editorial layout.

One large jewellery/lifestyle image + elegant typography.

Heading:
“Jewellery for Every Version of You.”

Create a short placeholder brand story around modern jewellery that transitions between everyday wear, celebrations and gifting.

CTA:
DISCOVER ENVIAAR

------------------------------------------------

SECTION 5 – SHOP THE LOOK

Use a large model/lifestyle photograph.

Allow subtle clickable product hotspots on jewellery pieces.

Clicking a hotspot should open a small elegant product preview:
Product image
Name
Price
View Product

------------------------------------------------

SECTION 6 – FESTIVE EDIT

Large cinematic visual.

Heading:
THE FESTIVE EDIT

Text:
Statement pieces created for celebrations, occasions and everything worth remembering.

CTA:
EXPLORE FESTIVE JEWELLERY

------------------------------------------------

SECTION 7 – WHY ENVIAAR

Create an extremely clean horizontal section.

Use minimal line icons.

ANTI-TARNISH
Designed for lasting shine.

HYPOALLERGENIC
Made with comfort in mind.

PREMIUM FINISH
Rhodium & gold-plated selections.

92.5 SILVER
Selected jewellery crafted in sterling silver.

Do not make this look like generic feature cards.

------------------------------------------------

SECTION 8 – BESTSELLERS

Premium product carousel.

Show:
image
name
price
wishlist
quick add

------------------------------------------------

SECTION 9 – MEN’S COLLECTION

Dedicated editorial banner.

Title:
ENVIAAR FOR HIM

Show:
Men’s bracelets
Rings
Chains / accessories where applicable

CTA:
SHOP MEN

------------------------------------------------

SECTION 10 – INSTAGRAM / SOCIAL

Heading:
@ENVIAAR

“Follow our world of jewellery.”

Create a clean Instagram-inspired gallery with 5–6 images.

Images should open an elegant lightbox.

CTA:
FOLLOW ON INSTAGRAM

------------------------------------------------

SECTION 11 – NEWSLETTER

Keep extremely minimal.

“Stay in the ENVIAAR Circle.”

Email input
SUBSCRIBE button

------------------------------------------------
HOMEPAGE POPUP
------------------------------------------------

Create an attractive promotional popup.

Do NOT show immediately.

Show approximately 3–5 seconds after entering the homepage OR when exit intent is detected.

Desktop:
Split popup.

Left:
Elegant jewellery/model photograph.

Right:
ENVIAAR logo

Heading:
A LITTLE SOMETHING FOR YOU

Text:
Join the ENVIAAR circle and enjoy 10% off your first order.

Email field

GET MY 10% OFF

Small:
No thanks, I’ll continue browsing.

Close X.

Store dismissed state in localStorage so it does not annoy users repeatedly.

Popup must be light, minimal and premium.

------------------------------------------------
LOGIN / SIGN UP
------------------------------------------------

Do NOT use a boring standalone login screen.

Clicking Account from the header should open a sophisticated side drawer or modal.

LOGIN

Welcome Back

Email Address
Password

Forgot Password?

LOGIN

Divider:
OR

Continue with Google

“New to ENVIAAR?”
CREATE ACCOUNT

Registration form:
First Name
Last Name
Email
Mobile Number
Password
Confirm Password

Checkbox:
Receive new collection and offer updates.

CREATE ACCOUNT

Use clean floating labels and excellent form validation.

After login show Account dashboard:
Profile
Addresses
Orders
Wishlist
Logout

------------------------------------------------
COLLECTION / SHOP PAGE
------------------------------------------------

Top:
Elegant breadcrumb.

Collection heading with optional editorial banner.

Example:
EARRINGS
“Details that complete the story.”

Product count.

Desktop:
Filter sidebar or premium filter drawer.

Mobile:
Filter button opens bottom sheet/drawer.

Filters:
Category
Subcategory
Price
Material
Finish
Availability

Material / Finish:
92.5 Silver
Gold Plated
18K Gold Plated
22K Gold Plated
Rhodium Plated
Anti-Tarnish
Hypoallergenic

Sort:
Featured
Newest
Price Low to High
Price High to Low

Grid:
Desktop 4 columns
Tablet 3
Mobile 2

Include:
pagination or elegant Load More.

------------------------------------------------
PRODUCT CARD
------------------------------------------------

Product image must dominate the card.

Image ratio should remain consistent.

On hover:
change to alternate image.

Information:
Product Name
Short finish/material
₹ Price

Wishlist icon.

Quick Add appears on hover.

Badges only when relevant:
NEW
BESTSELLER
925 SILVER

Avoid excessive sale badges.

------------------------------------------------
PRODUCT DETAIL PAGE
------------------------------------------------

Create a premium Shopify-like product experience.

Desktop:
Left 60% image gallery
Right 40% sticky product information.

Images:
4–6 images
zoom
thumbnail navigation
fullscreen image viewer

Information:

Product name

Rating + reviews

Price in ₹

Short description

Finish selector where applicable:
Silver
Gold
Rose Gold

Size selector for rings/bracelets if applicable.

Quantity selector.

ADD TO BAG

BUY IT NOW

Add to Wishlist

Delivery checker:
Enter PIN Code
CHECK

Show:
Estimated delivery
Shipping information

Below CTA show subtle trust information:
Secure Payments
Easy Support
Quality Checked

Expandable accordions:

Product Details
Materials & Finish
Jewellery Care
Shipping & Returns

Example material tags:
Anti-Tarnish
Hypoallergenic
92.5 Silver
Rhodium Plated
18K / 22K Gold Plated

Below:
YOU MAY ALSO LIKE

RECENTLY VIEWED

------------------------------------------------
CART DRAWER
------------------------------------------------

Clicking bag should open a right-side mini cart.

Show:
product thumbnail
product name
finish/size
quantity controls
price
remove

Subtotal

VIEW BAG
CHECKOUT

Also show:
“You’re ₹___ away from free shipping”
with progress indicator.

------------------------------------------------
CART PAGE
------------------------------------------------

Full cart page.

Products
Quantity
Price
Remove

Coupon input.

Order Summary:
Subtotal
Discount
Shipping
Total

PROCEED TO CHECKOUT

------------------------------------------------
CHECKOUT
------------------------------------------------

Create a clean Shopify-inspired checkout UI.

Steps:
Information
Shipping
Payment

Customer:
Email
Mobile

Shipping:
Name
Address
Apartment
City
State
PIN Code

Payment UI placeholders:
UPI
Credit / Debit Card
Net Banking
Wallet
Cash on Delivery

Order summary stays visible on desktop.

NOTE:
Only build UI/frontend payment placeholders unless an actual gateway is connected.

------------------------------------------------
SEARCH
------------------------------------------------

Click Search in header.

Open a large premium search overlay.

Input:
“Search ENVIAAR”

Show live suggestions.

Sections:
Products
Collections
Popular Searches

Example popular searches:
Earrings
Mangalsutra
92.5 Silver
Festive
Bracelets

------------------------------------------------
WISHLIST
------------------------------------------------

Functional wishlist.

Heart icons should save/remove products.

Persist wishlist using localStorage for prototype.

If logged in, structure code so it can later sync with backend.

------------------------------------------------
ABOUT PAGE
------------------------------------------------

Make this page editorial.

Hero:
ENVIAAR story.

Sections:
Our Story
Our Philosophy
Materials & Craft
Everyday to Occasion
The ENVIAAR Woman

Use large images with alternating editorial layouts.

Avoid generic cards.

------------------------------------------------
CONTACT PAGE
------------------------------------------------

Create an elegant contact experience.

Contact form:
Name
Email
Phone
Subject
Message

SEND MESSAGE

Include:
Email
Instagram
Customer support information

Optional:
WhatsApp CTA

------------------------------------------------
FOOTER
------------------------------------------------

Large clean footer.

ENVIAAR

SHOP
New Arrivals
Earrings
Necklaces
Bracelets
Rings
Men’s

HELP
Contact
Shipping
Returns
Jewellery Care
FAQs

ABOUT
Our Story
Instagram

LEGAL
Privacy
Terms

Newsletter field.

Social icons:
Instagram
Facebook
Pinterest

Bottom:
© ENVIAAR

------------------------------------------------
INTERACTIONS & ANIMATION
------------------------------------------------

Animations must feel refined.

Use:
Framer Motion

Add:
page transitions
fade-up sections
image reveals
subtle parallax
hover image zoom
drawer animations
mega menu transitions
modal transitions

Do NOT use:
heavy bouncing
excessive floating objects
flashy animation
3D gimmicks

Luxury = restraint.

------------------------------------------------
RESPONSIVE REQUIREMENTS
------------------------------------------------

Fully responsive:
Desktop
Laptop
Tablet
Mobile

Mobile must feel like a real premium shopping app.

Mobile:
sticky header
2-column product grids
bottom-sheet filters
full-screen menu
touch-friendly controls
sticky Add to Bag on product detail page

------------------------------------------------
FUNCTIONAL REQUIREMENTS
------------------------------------------------

This should NOT be only a visual mockup.

Create reusable React components and functional state.

Required working interactions:

Navigation
Routing
Mega menu
Mobile menu
Search overlay
Login modal
Registration modal
Forgot password UI
Homepage promotional popup
Wishlist
Add to cart
Cart drawer
Quantity update
Remove from cart
Product filters
Product sorting
Quick view
Product gallery
Image zoom
Finish selection
Size selection
Pincode checker UI
Coupon UI
Checkout form
Newsletter
Contact form
Instagram lightbox

Use localStorage for:
cart
wishlist
recently viewed products
popup dismissed state

Create clean mock product JSON/data so the complete frontend works immediately.

------------------------------------------------
TECH STACK
------------------------------------------------

React
TypeScript
Vite
Tailwind CSS
React Router
Framer Motion
Lucide icons

Keep architecture ready for later backend/API integration.

Structure components properly:

components/
layouts/
pages/
data/
hooks/
context/
types/
utils/

Create:
CartContext
WishlistContext
AuthContext

Do not hardcode repeated UI.

------------------------------------------------
IMAGE DIRECTION
------------------------------------------------

Use high-quality placeholder/reference jewellery imagery during development.

Image direction:
premium jewellery macro photography
clean ivory backgrounds
soft daylight
neutral skin tones
minimal styling
close-up earrings
necklace details
bracelet/ring macro shots
editorial model jewellery photography

Avoid generic AI-looking jewellery imagery wherever possible.

Keep image URLs/data centralized so we can easily replace all images later with ENVIAAR's actual product photography.

------------------------------------------------
IMPORTANT FINAL INSTRUCTION
------------------------------------------------

I do not want a generic jewellery template.

ENVIAAR should visually sit between:
1. a modern premium jewellery editorial website
2. a polished Shopify shopping experience

But it must maintain its own brand identity.

Prioritize:
Whitespace
Photography
Typography
Product presentation
Ease of shopping
Mobile experience

The final UI should be SIMPLE and SUBTLE, but it must still feel premium.

Do not make the website dark.

Build ALL specified pages and routes, not a single-page section-switching website.

Before finishing:
- verify every navigation item
- verify every CTA
- verify mobile menu
- verify login/register
- verify wishlist
- verify cart
- verify filters
- verify product links
- verify checkout forms
- remove dead buttons
- remove empty placeholder sections
- fix responsive overflow
- ensure every page has a polished mobile version

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://enviaar-jewels-boutique.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/498066f4-ca77-48bf-a845-fed48162fe5a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
