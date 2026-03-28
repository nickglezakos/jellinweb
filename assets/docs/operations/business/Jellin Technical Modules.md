# Jellin — Technical Modules

This document outlines the core technical modules of the Jellin platform, covering how loyalty programs, coupons, check-ins, user roles, groups, cross-business collaboration, delivery, and analytics work together.

---

## 1. Loyalty Programs

A business owns a single Jellin account and can create **multiple loyalty programs** under it. Each loyalty program defines the rules for how customers earn and redeem rewards.

Loyalty programs are the top-level container for all reward activity. They are assigned to **groups** (see Section 5), which determine which users and points of sale can operate under them.

---

## 2. Coupons

Each loyalty program supports **three coupon types**:

### 2.1 Counting Coupon

A counting coupon is earned after **X consecutive check-ins**. The business defines the threshold (e.g., "free coffee after 5 check-ins").

**How it works:**
1. A customer checks in at the point of sale (see Section 3 for check-in methods).
2. The employee assigns **Jells** to the customer — as many as the operation brief dictates (e.g., 1 Jell per visit, 2 Jells for a premium purchase).
3. Once the customer accumulates the required number of Jells, the counting coupon is automatically generated and awarded.

Jell assignment is the core mechanic of counting coupons. The employee controls how many Jells to award per interaction, following the business's operational guidelines.

### 2.2 Instant Coupon

An instant coupon is assigned **immediately** by the employee at the point of interaction — no accumulation required.

**How it works:**
1. A customer checks in or is identified at the point of sale.
2. The employee assigns an instant coupon directly (e.g., "20% off today", "free appetizer", "match ticket").
3. The customer receives the coupon immediately.

Instant coupons are especially useful for:
- Welcome offers (e.g., hotel check-in rewards)
- Cross-business partner promotions
- One-time incentives and event-based rewards

### 2.3 Sweepstake Coupon

A sweepstake coupon is awarded **randomly** to customers enrolled in a loyalty program — no employee action or check-in required at the moment of award.

**How it works:**
1. The business user creates a sweepstake for a specific loyalty program.
2. They set a **start date** and **end date** for the sweepstake period.
3. They define the **number of coupons** to be awarded randomly within that period.
4. The system automatically selects random customers from the loyalty program's enrolled base and awards them the coupon.

**Configuration:**
- **Loyalty program**: Which program's customer base participates.
- **Date range**: Start and end dates defining the sweepstake window.
- **Coupon quantity**: How many coupons will be distributed randomly across the date range.

Sweepstake coupons are useful for:
- Driving engagement during slow periods or seasonal campaigns
- Creating viral excitement and surprise-and-delight moments
- Re-engaging dormant customers who are enrolled but haven't visited recently
- Lottery-style promotions that encourage word-of-mouth

---

## 3. Check-In Methods

Check-in is the moment a customer is identified at a point of sale. Jellin supports two check-in methods:

### 3.1 App Check-In (QR Scan)

For customers who have installed the Jellin app on their phone:

1. The customer opens the Jellin app and presents their **profile QR code**.
2. The employee opens their **Jellin Business App** and scans the QR code.
3. The check-in is recorded instantly.

### 3.2 No-App Check-In (Phone Number / Email)

For customers who have opted out of the app:

1. The customer tells the employee their **mobile number** or **email address**.
2. The employee enters it in the Jellin Business App.
3. The check-in is recorded.

**After check-in** (both methods), the employee can:
- **Assign Jells** toward a counting coupon, or
- **Assign an instant coupon** directly.

This dual approach ensures that every customer can participate regardless of whether they've downloaded the app.

---

## 4. User Roles & Permissions

Each Jellin business account supports **unlimited users**. There are three role tiers:

### 4.1 Owner

- Full control of the Jellin account.
- Can create and manage loyalty programs, groups, and users.
- Can invite external users (from other businesses) via email.
- Full access to analytics.

### 4.2 Manager

- Full approval credentials.
- Can create and manage loyalty programs, groups, and users.
- Can **cancel appointed coupons** when necessary (e.g., disputes, errors, policy exceptions).
- Full access to analytics.

### 4.3 Employee (Operator)

- Can perform check-ins and assign rewards to customers.
- Permissions are scoped to their assigned coupon types:
  - **Jells only** — can assign Jells toward counting coupons.
  - **Instant coupons only** — can assign instant coupons.
  - **Both** — can assign Jells and instant coupons.
- Cannot manage loyalty programs, groups, or other users.
- Does not have access to analytics or cancellation capabilities.

---

## 5. Groups

Groups are the organizational unit that connects **loyalty programs**, **users**, and **points of sale**.

A business can create **as many groups as needed**. Each group can contain:
- **Multiple loyalty programs** — defining which reward campaigns are active in that group.
- **Multiple users** — defining which employees/operators can work within that group.

### Use Cases for Groups

| Group Type | Purpose | Example |
|------------|---------|---------|
| **Own network** | Organize internal points of sale | A gym chain creates a group per city with its own branch employees assigned. |
| **Satellite / partner** | Enable cross-business collaboration | A hotel creates a group for partner businesses (cafe, boutique) and invites external users. |
| **Campaign-specific** | Isolate specific promotions | A mall creates a seasonal group with a holiday loyalty program active only during December. |

---

## 6. Cross-Business Collaboration

Jellin enables **cross-business rewards** through the combination of groups, loyalty programs, and external user invitations.

### How It Works

1. **Business A** (e.g., a hotel) creates a group specifically for partner collaboration.
2. Business A activates one or more loyalty programs within that group.
3. Business A **invites users from Business B** (e.g., a nearby cafe) via email.
4. The invited user joins as an **employee/operator** within that specific group.
5. The invited user can now assign rewards (typically **instant coupons only**) to customers under Business A's loyalty program.

### Typical Setup

A business will maintain two types of groups:

- **Internal groups** — for their own shops (points of sale), staffed by their own employees who can assign both Jells and instant coupons.
- **Partner groups** — for satellite/network businesses, where invited external operators are restricted to assigning **instant coupons only**.

This structure enables a hotel guest to earn a coupon at check-in and redeem it at a partner cafe — without the cafe needing its own Jellin loyalty program. The partner simply operates within the hotel's ecosystem.

---

## 7. Coupon Delivery

Coupons reach customers through multiple channels, ensuring participation without requiring an app download.

### 7.1 Email Delivery

- Coupons are sent to the customer's email address.
- Each email contains the **QR code of the coupon**.
- The customer can present the QR code from their email at any participating point of sale.
- **No app download required.**

### 7.2 App Delivery

- For customers with the Jellin app installed, coupons appear directly in the app.
- Customers present their in-app QR code for scanning.

### 7.3 SMS Delivery

- Coupons can also be delivered via SMS with a QR link.

### Cross-Business Redemption via Email

Email-based delivery is essential for cross-business scenarios:

1. A customer earns a coupon at **Business A** (e.g., a hotel).
2. The coupon is sent to the customer's email with a QR code.
3. The customer visits **Business B** (e.g., a partner cafe or stadium).
4. The customer shows the QR code from their email.
5. The employee at Business B scans or verifies the QR code.
6. The coupon is redeemed — acting as an **instant coupon offer** or even a **ticket**.

This flow works without either party needing anything beyond an email address and a QR scanner.

---

## 8. Analytics

Jellin provides **full analytics** across all modules, accessible to **Owners** and **Managers**.

### Analytics Dimensions

Analytics can be segmented and filtered across multiple combinations, including:

| Dimension | Examples |
|-----------|----------|
| **By loyalty program** | Performance of each loyalty program individually |
| **By group** | Activity across internal groups vs. partner groups |
| **By point of sale** | Traffic and redemption per location |
| **By user / employee** | Individual operator performance and transaction patterns |
| **By coupon type** | Counting coupon vs. instant coupon activity |
| **By customer** | Visit frequency, Jell accumulation, redemption history |
| **By time period** | Daily, weekly, monthly trends |
| **Cross-business** | Partner network contribution and cross-redemption rates |

### Key Metrics

- Customer visit frequency and trends
- Jell accumulation and redemption rates
- Coupon assignment volume by employee
- Campaign performance and ROI
- Segmentation by salepoint, loyalty program, and group
- Anomaly detection for out-of-policy transaction patterns

### Access Control

| Role | Analytics Access |
|------|-----------------|
| Owner | Full access to all analytics and dimensions |
| Manager | Full access to all analytics and dimensions |
| Employee | No analytics access |

---

## Module Relationship Overview

```
Jellin Business Account (1 per business)
│
├── Loyalty Programs (multiple)
│   ├── Counting Coupons (earned after X Jells)
│   ├── Instant Coupons (assigned immediately)
│   └── Sweepstake Coupons (awarded randomly within a date range)
│
├── Groups (multiple)
│   ├── Assigned Loyalty Programs
│   ├── Assigned Users (internal employees)
│   └── Invited Users (external operators from partner businesses)
│
├── Users
│   ├── Owner — full control, analytics, invitations
│   ├── Manager — programs, groups, users, cancellations, analytics
│   └── Employee — check-ins and coupon assignment (scoped permissions)
│
├── Check-In
│   ├── App (QR scan from customer's Jellin app)
│   └── No-App (phone number or email lookup)
│
├── Delivery
│   ├── Email (QR code in email — no app needed)
│   ├── App (in-app coupon with QR)
│   └── SMS (QR link via text)
│
└── Analytics
    └── Full reporting by program, group, salepoint, user, coupon type, customer, time
```
