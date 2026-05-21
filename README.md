🛒 Mini E-Commerce Platform

A scalable, production-oriented mini e-commerce platform built with Next.js, TypeScript, Supabase, Zustand, TanStack Query, Formik, and Tailwind CSS, featuring authentication, product browsing, cart management, checkout, and StarPay payment integration.

```txt
🚀 Live Demo
Production URL: https://mini-e-commerce-dkxg.vercel.app/
GitHub Repository: https://github.com/YonasEngineer/mini-e-commerce
```
📁 Project Architecture
## Key Architectural Decisions

### Feature-Based Folder Structure
The project uses a feature-oriented structure for scalability and maintainability instead of grouping files only by type.

### Zustand for Client State
Zustand manages lightweight client/UI state such as:
- Cart state
- Cart sidebar modal
- Temporary UI flags

### TanStack Query for Server State
TanStack Query handles:
- Product fetching
- Server caching
- Background refetching
- Async loading/error states

### API Abstraction Layer
Axios is centralized through reusable API clients to avoid duplicated request logic.

### Secure Payment Architecture
StarPay integration is implemented through Next.js server-side API routes to avoid exposing private credentials on the client.

### Supabase as Backend Service
Supabase is used for:
- Authentication
- Database
- User sessions
- Product and order storage



```txt
MINI-E-COMMERCE/
│
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main application routes
│   │   ├── cart/                 # Cart page
│   │   ├── checkout/             # Checkout flow
│   │   ├── payment/
│   │   │   ├── success/          # Payment success page
│   │   │   └── fail/             # Payment failure page
│   │   └── product/
│   │       └── [id]/
│   │           ├── page.tsx      # Product details page
│   │           
│   │           
│   │
│   ├── api/                      # Backend API routes (Next.js server layer)
│   │   ├── cart/                 # Cart APIs
│   │   ├── pay/                  # Payment initiation
│   │   └── starpay/
│   │       └── callback/
│   │           └── route.ts      # StarPay webhook/callback handler
│   │
│   ├── auth/                     # Authentication pages (Supabase)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── favicon.ico
│
├── components/                  # Reusable UI components
│   ├── auth/                    # Auth components
│   ├── cart/                    # Cart components
│   ├── CartSidebarModal/       # Cart modal UI
│   ├── checkout/               # Checkout components
│   ├── common/                # Shared components
│   │   ├── Footer.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── header/
│   ├── payment/
│   │   └── Success.tsx
│   ├── product/
│   │   ├── Product.tsx
│   │   └── ProductDetail.tsx
│   └── ui/                     # Base UI components (buttons, inputs, etc.)
│
├── context/                    # React Context providers
├── custom-hook/               # Custom hooks
├── generated/                 # Auto-generated files (e.g. Prisma client)
├── lib/                       # Utilities (axios, helpers, configs)
├── prisma/                    # Database schema & migrations
├── providers/                 # App providers (QueryClient, Auth, etc.)
├── public/                    # Static assets
├── seeder/                   # Database seeding scripts
├── store/                    # Zustand state management
├── types/                    # TypeScript types
│
├── .env                      # Environment variables
├── .gitignore
├── components.json          # UI config (likely shadcn)
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

Key Design Principle
 UI is fully separated from business logic
 API layer is abstracted via /api
 Server communication is centralized through Axios instance
 State management is split:
 Zustand → UI state (cart, UI flags)
 TanStack Query → server state (products, orders)


 
🧾 Assumptions Made

 Products are pre-seeded in Supabase
 StarPay returns a redirect URL after initialization
 User authentication is required before checkout
 Cart is user-specific after login
 Guest cart is supported locally before authentication


## Tradeoffs Considered

### Zustand vs Redux
Zustand was chosen because it provides simpler boilerplate and faster development for medium-scale applications.

### Guest Cart Persistence
Guest carts are stored locally for improved UX before authentication, though syncing across devices is limited until login.

### Prisma + Supabase
Prisma improves type safety and database developer experience, although Supabase can work directly without Prisma.

### Server-Side Payment Initialization
Payment initialization adds additional backend complexity but improves security by protecting StarPay credentials.



## Environment Variables

DATABASE_URL=
Used by Prisma to connect to the Supabase PostgreSQL database via connection pooling.

DIRECT_URL=
Direct database connection used for Prisma migrations and schema changes (bypasses pooling).

STARPAY_SECRET=
Secret API key used on the server side to securely initialize payments with StarPay. Must never be exposed on the client.

NEXT_PUBLIC_SUPABASE_URL=
Public Supabase project URL used to initialize the Supabase client.

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
Public Supabase anon/publishable key used for authentication and client-side access to Supabase services.

CALL_BACK_URL=
Server-side endpoint that receives StarPay payment confirmation callbacks/webhooks after payment processing.

REDIRECT_URL=
Frontend URL where users are redirected after successful payment completion.

