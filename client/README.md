# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

client/
├── public/
│   ├── assets/
│   │   └── images/                 # Your images (products, blog, branding)
│   │       ├── products/
│   │       ├── blog/
│   │       ├── shopbystory/
│   │       └── ...
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── blog/
│   │   │   ├── BlogBody.jsx        # Renders long-form block content
│   │   │   └── BlogCard.jsx        # Post preview card
│   │   ├── cart/
│   │   │   ├── CartItem.jsx        # Individual item row in cart
│   │   │   └── CartSummary.jsx     # Sticky right-side totals box
│   │   ├── common/
│   │   │   ├── EmptyState.jsx      # Reusable empty UI state
│   │   │   ├── HeartButton.jsx     # Reusable wishlist toggle
│   │   │   └── Skeletons.jsx       # Loading states
│   │   ├── products/
│   │   │   ├── ProductCard.jsx     # Card with hover cycling images
│   │   │   ├── ProductFilters.jsx  # Sidebar filters for Shop
│   │   │   ├── ProductGallery.jsx  # Image gallery for Detail page
│   │   │   └── ProductGrid.jsx     # Grid wrapper with loading state
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx         # Logged-in user state & JWT hydration
│   │   ├── CartContext.jsx         # Live cart state & guest-to-user merge
│   │   └── WishlistContext.jsx     # Wishlist state & sync
│   ├── hooks/
│   │   └── useDebounce.js          # Delays search API calls
│   ├── layouts/
│   │   ├── AdminLayout.jsx         # Sidebar wrapper for /admin
│   │   └── AuthLayout.jsx          # Cinematic split-screen for Login/Signup
│   ├── pages/
│   │   ├── admin/                  # Admin Dashboard Pages
│   │   │   ├── AdminCoupons.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProductEdit.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── BlogListPage.jsx        # /blog
│   │   ├── BlogPostPage.jsx        # /blog/:slug
│   │   ├── CartPage.jsx            # /cart
│   │   ├── CheckoutPage.jsx        # /checkout
│   │   ├── ContactPage.jsx         # /contact
│   │   ├── ForgotPasswordPage.jsx  # /forgot-password
│   │   ├── HomePage.jsx            # The upgraded homepage (was HomeStub in App.jsx)
│   │   ├── LoginPage.jsx           # /login
│   │   ├── NotFoundPage.jsx        # 404
│   │   ├── OrderDetailPage.jsx     # /orders/:orderId
│   │   ├── OrdersPage.jsx          # /orders
│   │   ├── OrderSuccessPage.jsx    # /order-success/:orderId
│   │   ├── OurStoryPage.jsx        # /our-story
│   │   ├── PolicyPage.jsx          # /policies/:slug
│   │   ├── ProductDetailPage.jsx   # /shop/:slug
│   │   ├── ProfilePage.jsx         # /profile
│   │   ├── ResetPasswordPage.jsx   # /reset-password/:token
│   │   ├── ShopPage.jsx            # /shop
│   │   ├── SignupPage.jsx          # /signup
│   │   ├── TrackOrderPage.jsx      # /track-order
│   │   └── WishlistPage.jsx        # /wishlist
│   ├── routes/
│   │   ├── AdminRoute.jsx          # Blocks non-admins
│   │   └── ProtectedRoute.jsx      # Blocks logged-out users
│   ├── services/
│   │   ├── adminService.js         # Admin API calls
│   │   ├── api.js                  # Axios setup with auto-refresh
│   │   ├── authService.js          # Login, signup, me
│   │   ├── cartService.js          # Server cart API
│   │   ├── contactService.js       # Contact form
│   │   ├── newsletterService.js    # Footer subscribe
│   │   ├── orderService.js         # Place & track orders
│   │   ├── paymentService.js       # Razorpay init & verify
│   │   ├── policyService.js        # Fetch dynamic policy pages
│   │   ├── postService.js          # Fetch blog posts
│   │   ├── productService.js       # Fetch products & categories
│   │   ├── reviewService.js        # Fetch & submit reviews
│   │   └── wishlistService.js      # Server wishlist API
│   ├── utils/
│   │   ├── constants.js            # Sizes, sorting options
│   │   └── formatCurrency.js       # ₹ formatter
│   ├── App.jsx                     # Main router & layout shell
│   ├── index.css                   # Tailwind + brand styles
│   └── main.jsx                    # React entry point
├── .env                            # Local environment variables
├── .env.example
├── index.html                      # Vite HTML shell (Google fonts)
├── package.json
├── postcss.config.js
├── tailwind.config.js              # Brand colors & fonts
└── vite.config.js
