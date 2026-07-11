## Authentication

POST /auth/login (Public)

POST /auth/refresh-token (Public)

POST /auth/logout (Logged In User)

## User APIs

POST https://gear-up-vlxn.onrender.com/api/users/register (Public)

GET https://gear-up-vlxn.onrender.com/api/users/me (Customer / Provider / Admin)

PATCH https://gear-up-vlxn.onrender.com/api/users/me (Customer / Provider / Admin)

## Category APIs

GET https://gear-up-vlxn.onrender.com/api/categories (Public)

POST https://gear-up-vlxn.onrender.com/api/categories (Admin)

PATCH https://gear-up-vlxn.onrender.com/api/categories/:id (Admin)

DELETE https://gear-up-vlxn.onrender.com/api/categories/:id (Admin)

## Gear APIs

GET https://gear-up-vlxn.onrender.com/api/gear (Public)

GET https://gear-up-vlxn.onrender.com/api/gear/:id (Public)

POST https://gear-up-vlxn.onrender.com/api/gear (Provider / Admin)

PATCH https://gear-up-vlxn.onrender.com/api/gear/:id (Provider / Admin)

DELETE https://gear-up-vlxn.onrender.com/api/gear/:id (Provider / Admin)

## Rental APIs

POST https://gear-up-vlxn.onrender.com/api/rentals (Customer)

GET https://gear-up-vlxn.onrender.com/api/rentals/my-orders (Customer)

GET https://gear-up-vlxn.onrender.com/api/rentals (Admin)

PATCH https://gear-up-vlxn.onrender.com/api/rentals/:id/status (Admin)

## Payment APIs

POST https://gear-up-vlxn.onrender.com/api/payments/create (Customer)

POST https://gear-up-vlxn.onrender.com/api/payments/webhook (Stripe Webhook)

GET https://gear-up-vlxn.onrender.com/api/payments/success (Stripe Redirect)

GET https://gear-up-vlxn.onrender.com/api/payments/cancel (Stripe Redirect)

GET https://gear-up-vlxn.onrender.com/api/payments (Customer)

GET https://gear-up-vlxn.onrender.com/api/payments/:id (Customer)

## Review APIs

POST https://gear-up-vlxn.onrender.com/api/reviews (Customer)

GET https://gear-up-vlxn.onrender.com/api/reviews/gear/:id (Public)

## Provider APIs

GET https://gear-up-vlxn.onrender.com/api/provider/orders (Provider)

PATCH https://gear-up-vlxn.onrender.com/api/provider/orders/:id (Provider)

## Admin APIs

GET https://gear-up-vlxn.onrender.com/api/admin/users (Admin)

PATCH https://gear-up-vlxn.onrender.com/api/admin/users/:id (Admin)

GET https://gear-up-vlxn.onrender.com/api/admin/gear (Admin)

GET https://gear-up-vlxn.onrender.com/api/admin/rentals (Admin)
