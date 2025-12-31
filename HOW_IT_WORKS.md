# How Everything Connects

## System Flow Overview

### 1. Authentication Flow

```
User Registration/Login
    ↓
Frontend: authService.register/login()
    ↓
Backend: POST /api/auth/register or /login
    ↓
Backend: authController validates & creates/verifies user
    ↓
Backend: Returns JWT token + user data
    ↓
Frontend: Redux userSlice stores token & user in localStorage
    ↓
Axios interceptor adds token to all subsequent requests
```

### 2. Product Browsing Flow

```
User visits /products
    ↓
Frontend: ProductListingPage component mounts
    ↓
Frontend: productService.getProducts() called
    ↓
Backend: GET /api/products
    ↓
Backend: productController.getProducts() queries MongoDB
    ↓
Backend: Returns products array
    ↓
Frontend: Renders ProductCard components
```

### 3. Subscription Creation Flow

```
User clicks "Subscribe" on product
    ↓
Frontend: SubscriptionModal opens
    ↓
User fills form (quantity, interval, start date)
    ↓
Frontend: subscriptionService.createSubscription()
    ↓
Backend: POST /api/subscriptions
    ↓
Backend: subscriptionController.createSubscription()
    ↓
Backend: Creates Subscription document with nextDeliveryDate
    ↓
Backend: Returns subscription data
    ↓
Frontend: Redux subscriptionSlice updates state
    ↓
Modal closes, user sees success message
```

### 4. Automatic Order Generation Flow

```
Cron Job (runs daily at 2 AM)
    ↓
Backend: processSubscriptions() function called
    ↓
Queries MongoDB for active subscriptions where nextDeliveryDate <= today
    ↓
For each subscription:
    ├─ Creates Order document
    ├─ Updates nextDeliveryDate = today + interval
    ├─ If autoRenew = false, cancels subscription
    └─ Emits Socket.IO event to user's room
    ↓
Frontend: Socket.IO client receives notification
    ↓
Frontend: Refreshes subscriptions & cart data
    ↓
User sees notification: "Your subscription order has been created"
```

### 5. Shopping Cart Flow

```
User clicks "Add to Cart"
    ↓
Frontend: Redux cartSlice.addItemToCart()
    ↓
Frontend: cartService.addToCart()
    ↓
Backend: POST /api/cart/add
    ↓
Backend: cartController.addToCart()
    ↓
Backend: Updates/creates Cart document in MongoDB
    ↓
Backend: Returns updated cart
    ↓
Frontend: Redux cartSlice updates state
    ↓
Cart icon shows updated count
```

### 6. Checkout Flow

```
User clicks "Proceed to Checkout"
    ↓
Frontend: CheckoutPage renders
    ↓
User enters shipping address
    ↓
User clicks "Place Order"
    ↓
Frontend: orderService.createOrder()
    ↓
Backend: POST /api/orders
    ↓
Backend: orderController.createOrder()
    ├─ Creates Order document
    ├─ Calculates total from cart items
    └─ Clears user's cart
    ↓
Backend: Returns order data
    ↓
Frontend: Clears Redux cart state
    ↓
Frontend: Redirects to Dashboard → Orders
```

## Data Flow Between Collections

### User → Subscription → Order

```
User (userId)
    ↓
Creates Subscription (references userId & productId)
    ↓
Cron job creates Order (references userId & subscriptionId)
```

### User → Cart → Order

```
User (userId)
    ↓
Adds items to Cart (references userId & productId)
    ↓
Checkout creates Order (references userId, copies cart items)
```

## Redux State Management

### User Slice
- Stores: user object, token, isAuthenticated, loading, error
- Actions: registerUser, loginUser, getCurrentUser, logout
- Persists: token & user in localStorage

### Cart Slice
- Stores: items array, loading, error
- Actions: fetchCart, addItemToCart, updateCartItem, removeCartItem, clearCart
- Syncs: With backend Cart model

### Subscription Slice
- Stores: subscriptions array, loading, error
- Actions: fetchSubscriptions, createSubscription, updateSubscription, deleteSubscription
- Syncs: With backend Subscription model

## Socket.IO Real-time Communication

### Connection Flow

```
Frontend: useSocket hook runs when user authenticated
    ↓
Creates Socket.IO client connection
    ↓
Emits 'joinUserRoom' with userId
    ↓
Backend: Socket.IO server adds socket to user's room
    ↓
Backend: When subscription order created, emits to user's room
    ↓
Frontend: Receives 'subscriptionOrderCreated' event
    ↓
Frontend: Refreshes data & shows notification
```

## Protected Routes Flow

### Frontend Protection

```
User navigates to protected route
    ↓
ProtectedRoute component checks Redux state
    ↓
If not authenticated → Redirect to /login
    ↓
If adminOnly && not admin → Redirect to /
    ↓
If authenticated → Render component
```

### Backend Protection

```
Request arrives at protected route
    ↓
protect middleware extracts token from Authorization header
    ↓
Verifies JWT token
    ↓
Queries User from database
    ↓
Attaches user to req.user
    ↓
If admin route → admin middleware checks req.user.role
    ↓
If authorized → Proceeds to controller
    ↓
If unauthorized → Returns 401/403 error
```

## Error Handling Flow

### Frontend Error Handling

```
API call fails
    ↓
Axios interceptor catches error
    ↓
If 401 → Clears token, redirects to login
    ↓
Error passed to Redux thunk
    ↓
Redux slice stores error in state
    ↓
Component displays error message
```

### Backend Error Handling

```
Error occurs in controller
    ↓
Error thrown/caught
    ↓
Error passed to errorHandler middleware
    ↓
ErrorHandler formats error response
    ↓
Returns JSON with error message
```

## Subscription Status Management

### Status Transitions

```
active → paused (user pauses)
paused → active (user resumes)
active → cancelled (user cancels)
active → cancelled (autoRenew = false after order)
```

### Next Delivery Date Calculation

```
Initial: startDate + interval
After order: currentDate + interval
When paused/resumed: Recalculated from current date
```

## Database Relationships

### User Model
- Has many: Subscriptions (via userId)
- Has many: Orders (via userId)
- Has one: Cart (via userId)

### Product Model
- Has many: Subscriptions (via productId)
- Referenced in: Order items, Cart items

### Subscription Model
- Belongs to: User (userId)
- Belongs to: Product (productId)
- Has many: Orders (via subscriptionId)

### Order Model
- Belongs to: User (userId)
- Optional: Belongs to Subscription (subscriptionId)
- Contains: Array of items with productId references

## API Request/Response Flow

```
Frontend Component
    ↓
Service Function (e.g., productService.getProducts())
    ↓
Axios Instance (api.js) with interceptors
    ↓
HTTP Request (with JWT token if authenticated)
    ↓
Backend Route (e.g., /api/products)
    ↓
Middleware (auth if protected)
    ↓
Controller Function
    ↓
Mongoose Model Query
    ↓
MongoDB Database
    ↓
Response back through chain
    ↓
Redux Slice updates state
    ↓
Component re-renders with new data
```

## Key Integration Points

1. **Authentication**: JWT token stored in localStorage → Added to all API requests
2. **State Sync**: Redux state synced with backend via API calls
3. **Real-time**: Socket.IO connects frontend to backend for live updates
4. **Scheduled Tasks**: Cron job processes subscriptions independently
5. **Protected Routes**: Both frontend and backend enforce authentication
6. **Error Handling**: Consistent error handling across the stack

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Real-time capabilities
- ✅ Secure authentication
- ✅ Automatic order generation

