# Detail Level Guide

Helps maintain consistent granularity across domain documentation.

## The "Change UI" Test

For every flow step, ask: **"If we change from web to mobile, from React to Flutter, from Stripe to PayPal — does this step still make sense?"**

- "Customer clicks checkout button" → Fails test (UI-specific) → Too detailed
- "Customer initiates Checkout" → Passes test → Correct level
- "Customer pays" → Passes but lacks info → Too abstract

## Level Examples

**Too detailed (UI level):**
```
1. Customer clicks cart icon
2. Customer reviews items on cart page
3. Customer clicks "Proceed to checkout"
4. System shows shipping form
5. Customer fills address fields
```

**Too abstract:**
```
1. Customer buys Product
```

**Correct (Business Process level):**
```
1. Customer initiates Checkout from Cart
2. Customer provides Shipping Address
3. System calculates Shipping Cost and Tax
4. Customer selects Payment Method
5. System collects Payment
6. If Payment succeeds → Order is Confirmed
7. If Payment fails → Order is Pending, Customer is notified
```

## Per-Section Guidance

| Section | Level | Right | Wrong |
|---------|-------|-------|-------|
| Glossary | 1-2 sentence definition | "Order: A confirmed purchase containing one or more Line Items" | "Order: row in orders table with FK to users" |
| Flows | 1 step = 1 Domain Event or Command | "System collects Payment" | "System calls Stripe API with token" |
| Rules | One constraint, verifiable yes/no | "ORD-001: Order total cannot be negative" | "Validate order data" |
| Invariants | Cross-entity, always true | "A Customer can have at most one active Cart" | "Check cart table for duplicates" |
| Edge Cases | Scenario + expected behavior | "Last item in stock, two Customers checkout simultaneously: first to confirm wins" | "Handle race condition" |
