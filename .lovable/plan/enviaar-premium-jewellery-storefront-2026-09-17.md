# ENVIAAR Premium Jewellery Storefront

## Goal
Build a complete multi-page, frontend-only jewellery commerce experience that combines editorial luxury with familiar, frictionless shopping. All listed routes and interactions will work immediately using centralized mock catalogue data and browser persistence.

## Visual direction
- Warm ivory foundation, soft champagne and restrained blush surfaces, charcoal typography, and muted metallic-gold details.
- Editorial serif display type paired with a clean modern sans-serif for navigation, commerce, and forms.
- Large jewellery imagery, asymmetric compositions, strong whitespace, fine rules, restrained motion, and square-to-subtle corner radii.
- No dark mode, black-heavy styling, loud gradients, oversized pills, crowded cards, or generic storefront sections.
- Generate a cohesive jewellery photography set for the home, category, product, story, festive, men’s, mega-menu, and social experiences. Keep every image reference centralized for later replacement.

## Foundation and data
- Create semantic design tokens, typography, shared motion rules, focus states, layout widths, and accessible form styling.
- Install Framer Motion and build reusable primitives for buttons, overlays, drawers, fields, product imagery, breadcrumbs, filters, and editorial sections.
- Define typed product, collection, cart, wishlist, customer, and order models with realistic INR catalogue data.
- Add shared cart, wishlist, and prototype authentication state with browser persistence for cart, wishlist, recently viewed items, and promotion dismissal.

## Shared storefront experience
- Build a sticky announcement bar and premium header with desktop navigation, SHOP mega menu, centered ENVIAAR wordmark, and working search/account/wishlist/bag controls.
- Build a full-screen mobile menu, large live-search overlay, account login/register/forgot-password drawer, and animated cart drawer.
- Build the global footer with working shopping, help, story, legal, newsletter, and social links.
- Add restrained page transitions, section reveals, image zoom, drawer/modal transitions, and reduced-motion support.

## Pages and routes
- **Home:** Full editorial hero; asymmetric categories; new arrivals; story; interactive shop-the-look hotspots; festive edit; ENVIAAR benefits; bestsellers; men’s edit; Instagram gallery/lightbox; newsletter; delayed or exit-intent 10% popup.
- **Catalogue:** `/shop`, `/collections`, all requested collection routes, `/festive`, `/new-arrivals`, and `/bestsellers` with appropriate banners, filtering, sorting, product count, responsive grids, bottom-sheet mobile filters, and load more.
- **Product:** `/product/$slug` with alternate imagery, thumbnails, zoom/fullscreen viewer, finish and size selection, quantity, pincode result, wishlist, cart and buy-now actions, accordions, related products, and recently viewed products.
- **Shopping:** `/wishlist`, `/cart`, and `/checkout` with editable quantities, removals, coupon feedback, free-shipping progress, delivery steps, validated checkout fields, payment placeholders, and desktop order summary.
- **Customer:** `/account`, `/orders`, and `/order/$id` with polished prototype account, address, order-list, and order-detail states. Account access opens the drawer until prototype login succeeds.
- **Content:** `/about`, `/contact`, `/privacy`, `/terms`, `/shipping-policy`, `/returns`, and `/care-guide`, each with distinct content and metadata.
- **Search:** `/search` with query-driven product and collection results and popular-search fallbacks.

## Functional behavior
- Wire every navigation item, CTA, category, product, legal link, and social action to its intended destination.
- Make wishlist toggles, quick view, quick add, cart quantity/removal, finish/size selections, filters, sort, search suggestions, pincode checking, coupon feedback, newsletter, contact, and checkout forms interactive.
- Validate account, checkout, newsletter, and contact forms with clear inline feedback.
- Keep payment, authentication, order, newsletter, and contact submission as clearly presented frontend prototypes; no transaction processing or remote data storage is added.

## Quality checks
- Verify all listed routes and distinct page metadata.
- Test desktop and mobile navigation, menu, overlays, account flow, filters, product journey, cart, wishlist, checkout, lightbox, popup persistence, and forms.
- Check responsive overflow, two-column mobile grids, touch targets, sticky mobile add-to-bag, image loading, console/runtime errors, and the latest preview build.

## Technical details
- Preserve the existing TanStack Start routing architecture while implementing the requested React experience; use generated file routes rather than adding a second router.
- Organize code into `components`, `layouts`, `pages`, `data`, `hooks`, `context`, `types`, and `utils`.
- Use semantic Tailwind v4 tokens and existing UI primitives; use Framer Motion for animation and Lucide for icons.
- Payment choices remain non-processing UI placeholders because no gateway or commerce backend is connected.
