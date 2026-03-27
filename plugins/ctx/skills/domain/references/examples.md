# Domain Skill Examples

## Create Mode

```
User: /ctx:domain

Assistant reads vision.md and patterns-architecture.md.

Assistant asks:
- "What are the main entities in your system?"
- "What's the most important flow?"
- "Any rules that must always be true?"

User describes an e-commerce system.

Assistant drafts domain.md with Glossary (Customer, Product, Cart, Order, Payment),
Flows (Checkout, Refund), Rules (ORD-001..003, PAY-001), Invariants.

Shows draft → User says "looks good but add: free shipping over $50"
→ Assistant adds ORD-004, shows updated draft → User confirms → Writes file.
```

## Update Mode (from epic)

```
User: /ctx:epic "Add coupon system"

Epic skill detects domain impact: new entity Coupon not in glossary.
Epic skill generates draft domain changes:

  📘 Glossary — adding:
  | Coupon   | A discount code applied to an Order before Payment | Entity       |
  | Discount | The reduction amount a Coupon provides              | Value Object |

  📋 Flows — updating Checkout:
  - Adding variation: "Coupon applied: Customer enters Coupon before Payment.
    System validates → applies Discount to Order total."

  📏 Rules — adding:
  - CPN-001: A Coupon can only be used once per Customer
  - CPN-002: Only one Coupon per Order
  - CPN-003: Coupon cannot reduce Order total below zero

  ⚠ Invariants — updating:
  - Order total = sum of Line Items + Tax + Shipping − Discount

User: "CPN-002 wrong — allow stacking 2 coupons max"

Assistant updates: CPN-002: Maximum two Coupons per Order → confirms → writes.
```

## Split Mode

```
User: /ctx:domain --split

Assistant reads domain.md (600+ lines, 5 domains mixed together).
Proposes split into: order.md, payment.md, shipping.md, inventory.md, customer.md
domain.md keeps: Glossary + Invariants + index.

User confirms → files created.
```
