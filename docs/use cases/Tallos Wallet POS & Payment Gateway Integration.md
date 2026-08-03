# Tallos Wallet — Integration with Existing Retail POS & Payment Gateway

**Document Type:** Technical Integration Outline  
**Version:** 1.0  
**Date:** July 2026  

---

## Table of Contents

1. [System Components Overview](#a-system-components-overview)
2. [Integration Architecture Flow](#b-integration-architecture-flow)
3. [POS Integration Approaches](#c-pos-integration-approaches)
4. [Transaction Fee Model](#d-transaction-fee-model)
5. [Payment Gateway Integration](#e-payment-gateway-integration)
6. [Data Flow Summary](#f-data-flow-summary)
7. [Appendix I: Transaction Fees Flow — How and When Tallos Gets Paid](#appendix-i-transaction-fees-flow--how-and-when-tallos-gets-paid)
8. [Appendix II: Financial Infrastructure — Why Tallos Does Not Need a Separate Payment Gateway for Fees and Reversals](#appendix-ii-financial-infrastructure--why-tallos-does-not-need-a-separate-payment-gateway-for-fees-and-reversals)
9. [Appendix III: Using Stripe as the Financial Operations Layer](#appendix-iii-using-stripe-as-the-financial-operations-layer)

---

## A. System Components Overview

### 1. Tallos Wallet Consumer App (iOS/Android)

- User profile with unique QR code (membership/network ID)
- Digital wallet with stored value (prepaid balance)
- Add money functionality (via payment gateway)
- Payment QR generation for POS transactions
- Transaction history (payments, deposits, both)
- NFC capability as alternative to QR

### 2. Tallos POS Module (integrates into existing POS)

- QR scanner / NFC reader for consumer wallet identification
- Wallet as a selectable payment method alongside cash, credit/debit card
- Full or partial payment from wallet balance
- Real-time balance check and deduction
- **Transaction fee applied to every payment** — a fee charged on each wallet transaction to fund the operation of the entire Tallos system
- Fully reversible transactions (refunds back to wallet, including reversal of the transaction fee)
- Transaction confirmation and receipt generation

### 3. Payment Gateway — Acquirer (existing, third-party)

- Handles the actual money movement for wallet top-ups
- Direct money transfer from customer's bank/card to wallet
- Acts as the acquirer for merchant settlement — the gateway already has the merchant's banking details, settlement schedules, and reconciliation processes in place
- Tallos plugs into this existing infrastructure for all settlement
- Settlement and reconciliation endpoints

### 4. Tallos Platform Backend (orchestration layer)

- Wallet account management and balance ledger
- Transaction processing engine
- Transaction fee calculation and collection engine
- Batch settlement file generation for the payment gateway acquirer
- Integration APIs for POS and payment gateway
- Analytics and reporting

---

## B. Integration Architecture Flow

### Phase 1: Wallet Setup & Funding

1. Customer downloads Tallos Wallet app.
2. Customer registers/links profile and receives a unique QR identifier.
3. Customer adds money to wallet:
   - App triggers payment gateway integration.
   - Payment gateway processes bank/card transaction.
   - Funds credited to Tallos wallet balance.
   - Transaction recorded in wallet history as "Deposit."

### Phase 2: In-Store Payment at POS

1. Customer presents Tallos Wallet QR code (or taps NFC).
2. POS cashier scans QR / reads NFC via POS terminal.
3. POS terminal communicates with Tallos backend:
   - Validates customer wallet account.
   - Retrieves current wallet balance.
   - Displays balance to cashier.
4. POS presents "Wallet" as a payment option.
5. Cashier selects wallet payment:
   - **Full payment:** Deduct entire transaction amount + transaction fee from wallet.
   - **Partial payment:** Deduct specified sub-amount + transaction fee (remainder paid via other methods).
6. Backend processes deduction in a single atomic transaction — a **three-entry ledger split**:

   | Ledger Entry | Amount | Destination |
   |---|---|---|
   | Debit customer wallet | −(purchase + fee) | — |
   | Credit merchant settlement account | +purchase amount | Merchant's receivable balance |
   | Credit Tallos fee account | +fee | Tallos operational revenue |

   - Validates sufficient balance (purchase amount + transaction fee).
   - Debits wallet, credits merchant, and allocates fee simultaneously — no money sits in a pending pool.
   - The fee is extracted at authorization time and retained by Tallos immediately.
   - Returns confirmation to POS.
7. Transaction recorded in customer's wallet history as "Payment" (showing purchase amount + fee).
8. Receipt generated for both merchant and customer.

### Phase 3: Reversals / Refunds

1. Cashier initiates reversal from POS (same session or later).
2. Backend validates original transaction.
3. Wallet is credited back the full amount (purchase + transaction fee).
4. Transaction fee is also reversed back to the customer.
5. Fully reversible — no partial-refund limitation.
6. Customer sees reversal in transaction history.

---

## C. POS Integration Approaches

### Direct API Integration

The retailer's POS calls Tallos REST APIs directly for wallet balance check, payment, and reversal. This requires custom development on the POS side but offers the tightest integration — wallet transactions appear natively within the existing POS interface as a tender type, and all receipt and reporting flows remain unified.

**Key API endpoints the POS integrates with:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wallet/balance` | Look up customer wallet by QR/NFC identifier and return current balance |
| `POST` | `/wallet/pay` | Process a wallet payment (full or partial), receive confirmation and receipt data |
| `POST` | `/wallet/reverse` | Reverse a prior wallet transaction by transaction ID |
| `GET` | `/transaction/status` | Poll or webhook for transaction status updates |

### Payment Gateway Middleware

The payment gateway itself integrates with Tallos, so Tallos Wallet appears as just another payment method the gateway already supports. The POS does not change at all — it communicates with the payment gateway as usual. The gateway routes wallet payment requests to Tallos for balance verification and deduction, then returns the result to the POS in the same format as any other tender type.

**Key integration points between Payment Gateway and Tallos:**

- The gateway forwards wallet payment authorization requests to Tallos.
- Tallos validates balance and reserves/commits funds.
- The gateway receives the Tallos authorization response and relays it to the POS.
- Settlement and reconciliation handled through existing gateway-to-merchant processes.
- Top-up flows remain: the gateway processes the funding transaction, and Tallos credits the wallet.

---

## D. Transaction Fee Model

Every wallet payment made at the POS incurs a transaction fee. This fee:

- **Covers the operation of the entire Tallos system** — infrastructure, processing, support, and ongoing development.
- **Is calculated at the time of transaction** — applied on top of the purchase amount.
- **Is transparent to both parties** — visible on the customer's wallet history and the merchant's transaction log.
- **Is fully reversible** — if the transaction is reversed, the fee is returned to the customer along with the purchase amount.

### How the Fee Split Works

At the moment a payment is authorized, the Tallos backend performs an **atomic ledger split**. No money ever sits in a pending pool — the split is immediate and deterministic.

**Example — Standard Payment:**

```
Customer wallet balance: €100.00
Purchase amount:         €50.00
Transaction fee:          €0.05
Total to debit:          €50.05
```

Three ledger entries are recorded in a single transaction:

| Ledger Entry | Amount | Destination | Purpose |
|---|---|---|---|
| Debit customer wallet | −€50.05 | — | Deducted from customer's stored value |
| Credit merchant settlement account | +€50.00 | Merchant's receivable balance | What the merchant will be paid at settlement |
| Credit Tallos fee account | +€0.05 | Tallos operational revenue | Funds the entire Tallos platform |

The **Tallos fee account** accumulates all transaction fees across all merchants and customers. This is the revenue stream that funds:
- Server infrastructure and cloud hosting
- API and platform maintenance
- Security and compliance operations
- Customer and merchant support
- Ongoing product development

The merchant never sees or touches the fee — they only receive the purchase amount. The customer sees the total debit (purchase + fee) in their wallet history, with the fee displayed as a separate line item for full transparency.

**Example — Full Reversal:**

| Ledger Entry | Amount | Effect |
|---|---|---|
| Credit customer wallet | +€50.05 | Customer's balance restored in full |
| Debit merchant settlement account | −€50.00 | Recovered from merchant's receivable |
| Debit Tallos fee account | −€0.05 | Fee returned — Tallos earns nothing on reversed transactions |

The transaction fee is fully reversible. If the purchase is refunded, the customer gets back both the purchase amount **and** the fee. This ensures fairness — the customer only pays the transaction fee on completed purchases that are not reversed.

### Fee Flow Summary Table

| Scenario | Purchase | Fee | Total Wallet Debit | Merchant Receives | Tallos Retains |
|---|---|---|---|---|---|
| Standard payment | €50.00 | €0.05 | €50.05 | €50.00 | €0.05 |
| Full reversal | −€50.00 | −€0.05 | −€50.05 | −€50.00 | −€0.05 |

*Fee amount is illustrative — actual fee structure to be defined per deployment.*

---

## E. Payment Gateway Integration

### 1. Top-Up Flow

The payment gateway is involved when the customer adds money to their wallet.

- Tallos → Payment Gateway API: Initiate top-up transaction.
- Payment Gateway → Processing: Card/bank authorization and capture.
- Payment Gateway → Tallos: Webhook/callback confirming successful funding.
- Tallos credits wallet balance.

### 2. Payment Flow

The payment gateway routes wallet payment requests to Tallos for balance verification and deduction, then returns the result to the POS in the same format as any other tender type. The POS does not need to change — it communicates with the payment gateway as usual.

- POS → Payment Gateway: Authorization request with wallet as tender type.
- Payment Gateway → Tallos: Forward wallet payment for balance check + deduction.
- Tallos → Payment Gateway: Authorization response (approved/declined, balance info).
- Payment Gateway → POS: Standard authorization response.

### 3. Settlement Flow

Settlement is the process that happens **after** real-time authorization — the actual movement of money from the Tallos platform to the merchant's bank account. The transaction fee has already been extracted at authorization time (see Section D); settlement covers only the merchant's purchase amount.

The retailer's existing payment gateway (e.g., Stripe, Adyen, Worldpay, a local bank acquirer) acts as the acquirer — handling the actual bank settlement. The gateway already has the merchant's banking details, settlement schedules, and reconciliation processes in place. Tallos plugs into this existing infrastructure.

1. At authorization time, Tallos performs the same atomic ledger split described in Section D. The fee is already retained.
2. At the end of each settlement window, Tallos generates a **batch settlement file** containing only the merchant's purchase amounts:

   ```
   Settlement Batch — 2026-07-14
   Merchant ID: MERCH-0042
   Gateway Merchant Account: acct_7X9B2K
   
   Transaction ID | Amount  | Timestamp
   TXN-1001        | €50.00  | 09:14:22 UTC
   TXN-1002        | €30.00  | 11:47:08 UTC
   TXN-1003        | €120.00 | 16:03:55 UTC
   --------------------------------------
   Total:           | €200.00
   
   Fee Summary (retained by Tallos — not included in settlement):
   TXN-1001 fee: €0.05
   TXN-1002 fee: €0.05
   TXN-1003 fee: €0.05
   Total fees retained by Tallos: €0.15
   ```

3. Tallos transmits this batch file to the payment gateway via a secure API or SFTP.
4. The payment gateway processes the settlement as it would for any other tender type — debiting Tallos's settlement account and crediting the merchant's bank account for €200.00.
5. The **€0.15 in transaction fees never leaves Tallos** — they were already retained at authorization. The gateway never sees or touches the fee portion because the gross authorization (purchase + fee) was processed internally by Tallos, and only the net purchase amount enters the gateway settlement pipeline.
6. The merchant receives their usual settlement report from the gateway (showing €200.00 in Tallos wallet tender), plus a Tallos-specific fee statement for their records.

#### Money Flow Diagram

```
             CUSTOMER WALLET
           (€50.05 debited per tx)
                    │
                    ▼
          ┌─────────────────┐
          │  TALLOS BACKEND  │
          │  (atomic split   │
          │   at auth time)  │
          └──────┬──────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    ┌─────────┐    ┌──────────┐
    │ Merchant │    │  Tallos  │
    │  €50.00  │    │   €0.05  │
    │(purchase)│    │   (fee)  │
    └────┬─────┘    └────┬─────┘
         │               │
         ▼               ▼
    Settlement       Operational
    (via gateway     Revenue
     batch file)     (funds the
                     platform)
```

The key principle: **the fee is extracted at authorization time, not at settlement time**. Tallos never depends on the merchant or the payment gateway to remit the fee — it has already been retained from the customer's wallet at the moment of payment.

### 4. Reconciliation

- Daily settlement reports matching wallet debits to merchant deposits, aligned with the payment gateway's settlement batches.
- Payment gateway reports for top-up transactions.
- Transaction fee revenue reports for Tallos operations.
- Automated reconciliation via Tallos analytics dashboard.

---

## F. Data Flow Summary

```
[Consumer App] ←→ [Tallos Backend] ←→ [POS Terminal]
                       ↕
               [Payment Gateway]
                       ↕
               [Bank / Card Networks]
```

| Communication Path | Purpose |
|---|---|
| Consumer App ↔ Tallos Backend | Wallet balance, QR generation, transaction history, top-up requests |
| POS Terminal ↔ Tallos Backend | Customer lookup, balance check, payment processing (incl. fee), reversals |
| Tallos Backend ↔ Payment Gateway (Acquirer) | Top-up funding (wallet load); payment authorization routing; batch settlement file transmission |
| Tallos Backend → Merchant | Settlement reports, transaction fee statements, analytics |

---

## Appendix I: Transaction Fees Flow — How and When Tallos Gets Paid

This appendix answers the question: *How and when exactly does the Tallos owner company receive the transaction fees?*

### When: At Authorization Time — Instantly

The Tallos owner company receives its transaction fee revenue **the very moment a wallet payment is authorized at the POS**. This is not an end-of-month billing cycle, a periodic invoice, or a batch deduction from the merchant's settlement. It is a real-time, per-transaction extraction that occurs inside the Tallos backend during payment authorization.

Section B, Phase 2, Step 6 describes the three-entry atomic ledger split. Section E.3 reinforces the principle:

> *"The fee is extracted at authorization time, not at settlement time."*

### How: Atomic Ledger Split at the POS Transaction Moment

When a customer pays €50.00 at the POS using their Tallos wallet, the backend executes a **single atomic database transaction** with three simultaneous ledger entries:

| Ledger Entry | Amount | Where It Goes | Timing |
|---|---|---|---|
| Debit customer wallet | −€50.05 | Deducted from customer's prepaid balance | At authorization |
| Credit merchant settlement account | +€50.00 | Merchant's receivable — to be paid later at settlement | At authorization |
| Credit Tallos fee account | +€0.05 | **Tallos owner company's operational revenue — received instantly** | At authorization |

All three entries succeed or fail together as one atomic unit. There is no delay, no pending state, no waiting period — the €0.05 is credited to Tallos's fee ledger in the same database transaction that processes the purchase.

### Where the Fee Money Physically Sits

The money flow through the system can be traced in two stages:

#### Stage 1: Wallet Top-Up (before any purchase)

The customer loaded their wallet via the payment gateway (bank transfer or card payment). That money entered Tallos's financial ecosystem at top-up time and sits in the customer's wallet balance, custodied by Tallos.

#### Stage 2: Purchase (the fee is retained)

When the customer spends at the POS:

1. The total amount (€50.05) is debited from the customer's wallet balance.
2. The merchant's portion (€50.00) is earmarked for the merchant — it will be paid out at settlement.
3. The fee portion (€0.05) is credited to the **Tallos fee account** — an internal ledger that accumulates all transaction fee revenue. This money **stays within Tallos's operational accounts**. It is never destined for the merchant and is never part of any settlement batch.

#### Stage 3: Settlement (later — end of day)

At settlement time (see Section E.3), only the merchant's purchase amount moves onward. Tallos generates a batch settlement file containing the merchant's net purchase amounts and transmits it to the payment gateway. The gateway, acting as the acquirer, processes the settlement and credits the merchant's bank account.

The €0.05 fee that was credited to the Tallos fee account at authorization time **remains in Tallos's operational accounts**, available to fund the business. The fee is not included in the batch file — the gateway never sees or touches it. Tallos never depends on the merchant or the payment gateway to remit the fee — it was already retained from the customer's wallet the moment the payment was approved.

### Summary

| Question | Answer |
|---|---|
| **When does Tallos get paid?** | Instantly, at the moment of each POS payment authorization — real-time, per transaction |
| **How does Tallos get paid?** | Via the three-entry atomic ledger split that credits the Tallos fee account simultaneously with the customer debit and merchant credit |
| **Who pays the fee?** | The customer — it is deducted from their wallet balance as part of the total transaction debit |
| **Does the merchant ever touch the fee?** | No. The merchant never receives or forwards the fee. Only the net purchase amount enters the merchant's settlement |
| **What happens if the transaction is reversed?** | The fee is fully reversed along with the purchase amount. Tallos earns nothing on reversed transactions |
| **Does Tallos invoice anyone for fees?** | No. There is no billing cycle, no invoice, and no receivables. Fees are self-collected at the point of each transaction |

### Visual Timeline

```
   TOP-UP PHASE              PURCHASE PHASE              SETTLEMENT PHASE
   (days/weeks before)       (real-time at POS)          (end of day)
   
   Customer loads wallet     1. Customer pays €50.00     Merchant receives €50.00
   via Payment Gateway       2. Backend atomic split:    via gateway batch
                                • Customer −€50.05       settlement
   Money enters Tallos's       • Merchant +€50.00
   financial ecosystem         • Tallos fee +€0.05  ←─── Tallos gets paid HERE
                             3. Fee is retained instantly
                                by Tallos
```

---

---

## Appendix II: Financial Infrastructure — Why Tallos Does Not Need a Separate Payment Gateway for Fees and Reversals

This appendix answers the question: *Does the Tallos business owner need their own autonomous payment gateway to receive transaction fees and reimburse cancellations?*

The answer is **no** — and here is why.

### Fee Collection: No Payment Gateway Needed

The transaction fee is **never a separate payment event** that needs to be processed through a payment gateway. It is an **internal ledger reallocation** of money already inside Tallos's financial ecosystem.

The reasoning follows three stages:

1. **Top-up stage:** The customer loaded their wallet via the payment gateway (bank transfer or card payment). That money entered Tallos's pooled banking infrastructure at top-up time and is now under Tallos's custody.

2. **Purchase stage:** When the customer spends at the POS, the three-entry atomic split simply moves the fee from one internal ledger (customer wallet) to another internal ledger (Tallos fee account). No money leaves or enters Tallos's banking infrastructure. No card network, no acquiring bank, no payment gateway is involved.

3. **Analogy:** If you have a bank account and you move €0.05 from your checking to your savings account, you do not need a payment gateway — you are simply reorganizing your own money within accounts you already control.

### Reversals: Also No Payment Gateway Needed

The same principle applies to cancellations and refunds. When a transaction is reversed, all three ledger entries from the original transaction are reversed:

- Customer wallet is credited (+€50.05) — internal ledger credit
- Merchant settlement account is debited (−€50.00) — internal ledger reversal
- Tallos fee account is debited (−€0.05) — internal ledger reversal

Again, no payment gateway is involved. It is entirely internal accounting within Tallos's ledger system. The customer's wallet balance is restored from money already under Tallos's custody.

### What Tallos Actually Needs a Payment Gateway For

| Need | Requires Payment Gateway? | Details |
|---|---|---|
| Receiving customer top-up funds | **Yes** | Money enters from the outside world (customer's bank/card). This is the only point where a payment gateway is needed |
| Extracting transaction fees | **No** | Pure internal ledger operation on money already inside Tallos's ecosystem |
| Reimbursing reversals | **No** | Pure internal ledger operation — credits the customer's wallet balance using funds already custodied by Tallos |
| Paying out merchants (settlement) | **No (direct gateway integration)** | The payment gateway acts as acquirer — Tallos generates batch settlement files; the gateway handles the bank transfers to merchants |
| Customer wallet cash-out (withdrawal to bank) | **Likely yes** | If Tallos offers cash-out functionality in the future, it would need a payout/push-to-card capability via a gateway or banking partner |

### The Single Payment Gateway Model

The document describes a single payment gateway — the retailer's existing one — that serves two roles for Tallos:

1. **Inbound (top-ups):** Processing customer card/bank transactions to load wallet balances
2. **Outbound (settlement):** Acting as the acquirer to settle merchant payouts via batch files

Tallos does not need a second, independent payment gateway. The fee extraction and reversal reimbursement mechanisms operate entirely within Tallos's internal ledger — the only time money crosses the boundary between Tallos and the external financial system is during top-ups (money in) and settlement (money out to merchants).

---

## Appendix III: Using Stripe as the Financial Operations Layer

This appendix answers the question: *Can Tallos's entire financial ecosystem operations be covered by a third-party system like Stripe?*

The answer is: **Stripe can cover the payment infrastructure and banking layer, but not the entire Tallos financial ecosystem.** Stripe provides the *rails* — moving money between banks, cards, and accounts. Tallos provides the *application logic* — the wallet ledger, the atomic fee split, the POS integration, and the customer experience.

### What Stripe CAN Cover (Payment Infrastructure)

| Tallos Need | Stripe Product | How |
|---|---|---|
| Customer top-ups (card/bank → wallet) | Stripe Payments | Process card transactions, handle PCI compliance, settle funds into a Stripe balance |
| Holding pooled funds | Stripe Balance / Stripe Treasury | Funds from top-ups sit in a Stripe-managed account under Tallos's control |
| Merchant settlement payouts | Stripe Connect | Send payouts to merchant bank accounts; Stripe handles the actual bank rails (SEPA, ACH, etc.) |
| Know-your-customer (KYC) | Stripe Connect Onboarding | If needed for regulated wallet operations, Stripe handles identity verification |
| Reconciliation & reporting | Stripe Dashboard / API | Transaction-level data for matching against Tallos's internal ledger |

Stripe eliminates the need for Tallos to have its own direct banking relationships, PCI compliance infrastructure, or manual bank transfer operations. It provides the regulated, secure financial plumbing.

### What Stripe CANNOT Cover (Tallos-Specific Logic)

These remain Tallos's own application logic, built on top of Stripe's APIs:

| Tallos Function | Why Stripe Doesn't Cover It |
|---|---|
| **Wallet balance ledger** | Stripe doesn't know what "customer X has €100.00 in their Tallos wallet" means. That is a number in Tallos's database, not Stripe's. Even with Stripe Treasury, the Tallos app decides what balance to display to the user and whether a given purchase is authorized. |
| **Three-entry atomic ledger split** | When a POS payment happens, Tallos needs to simultaneously debit the customer wallet, credit the merchant receivable, and credit the Tallos fee account — all in one atomic unit. This is Tallos's application code making multiple Stripe API calls within a single database transaction. Stripe doesn't have a built-in "three-way split at POS time" endpoint. |
| **QR/NFC payment initiation at POS** | Stripe Terminal handles card-present payments but doesn't have a wallet QR scan flow. Tallos needs its own POS module that reads the QR, looks up the customer in its database, and then uses Stripe behind the scenes for the money movement. |
| **Transaction fee extraction at authorization** | The €0.05 fee retention is Tallos's business logic. Stripe moves money; Tallos decides how much goes where. |
| **Fee reversals on refunds** | When a purchase is reversed, Tallos must reverse the fee back to the customer. Stripe can process the refund, but Tallos's logic decides "this refund should also return the €0.05 fee to the customer's wallet." |

### The Architecture in Practice

```
                 TALLOS BACKEND
            (wallet ledger, atomic split
             logic, fee engine, POS API)
                      │
                      │  Uses Stripe APIs for all
                      │  money movement
                      ▼
              ┌───────────────┐
              │    STRIPE     │
              │ (the "rails") │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Card Networks   Bank Rails    Merchant
   (top-ups)      (SEPA/ACH)     Bank Accounts
                                 (payouts)
```

- **Tallos** owns the customer relationship, the wallet balance numbers, the fee model, the POS integration, and the entire user experience.
- **Stripe** owns the financial plumbing: card processing, bank transfers, PCI compliance, KYC, settlement rails.

### Important Considerations

1. **Wallet balance holding policies** — Holding prepaid consumer balances long-term may require specific Stripe approvals or a Stripe Treasury setup (a banking-as-a-service product with additional regulatory requirements). In the EU, this is a regulated e-money activity and may require Stripe to support it under their e-money license, or Tallos may need its own e-money institution (EMI) license depending on the structure.

2. **Stripe platform fees** — Stripe charges its own fees for processing transactions and Connect payouts. Tallos's €0.05 transaction fee must exceed Stripe's costs for the model to be profitable. Stripe's Connect pricing would apply to the merchant payout side, and standard card processing fees apply to top-ups.

3. **Regulatory classification** — If Tallos holds customer prepaid balances (even in a Stripe account), it may be classified as an e-money institution in the EU/UK, which has licensing implications regardless of using Stripe underneath. Legal review is essential before deployment.

### Bottom Line

Stripe (or an equivalent platform like Adyen) can cover **all the money movement and banking infrastructure** that Tallos needs. However, Stripe does not replace Tallos's core software — the wallet ledger, the atomic split engine, the fee logic, the POS integration, and the customer-facing experience must still be built and operated by Tallos. Using Stripe means Tallos does not need to also become a bank or a payment processor — it can focus on its core value proposition while relying on Stripe for the regulated financial rails.

---

*End of Document*
