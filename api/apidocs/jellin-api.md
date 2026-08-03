# Jellin API Documentation

> **Base URL:** `{{baseUrl}}`  
> **Auth:** Bearer Token (JWT) — except where marked as `Anonymous`  
> **Error format:** All `400 Bad Request` responses return a `ResultInfo` object unless noted otherwise.

---

## Table of Contents

- [Account](#account)
- [Referrals](#referrals)
- [Stripe](#stripe)
- [Summaries](#summaries)

---

## Account

**Base route:** `api/account`

---

### POST `api/account/confirmEmail`

Confirms a user's email using the activation key sent via email.

**Auth:** Anonymous

**Request Body:**

```json
{
  "activationKey": "string",
  "email": "user@example.com",
  "password": "string"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `activationKey` | string | Yes | Mapped from `UserUniqueId` |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | |

**Response:** `200 OK` — no body

---

### DELETE `api/account`

Deletes the currently authenticated account. If the logged-in operator owns a separate tenant, only the tenant association is removed; otherwise the full account is deleted.

**Auth:** Bearer Token

**Response:** `200 OK` — no body

---

### GET `api/account/connectionInfo`

Returns the connection/contact information of the currently authenticated operator.

**Auth:** Bearer Token

**Response `200 OK`:**

```json
{
  "id": "string",
  "phoneNumber": "string",
  "phoneNumberConfirmed": true,
  "email": "user@example.com",
  "emailConfirmed": true,
  "operatorOwnsSeparateTenant": false
}
```

**Response:** `404 Not Found` — if operator not found

---

### POST `api/account/login`

Authenticates a user and returns a JWT token.

**Auth:** Anonymous

**Request Body:**

```json
{
  "tenantId": 1,
  "email": "user@example.com",
  "password": "string"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tenantId` | int | No | Used when user belongs to multiple tenants |
| `email` | string | Yes | |
| `password` | string | Yes | |

**Response `200 OK` — Successful login:**

```json
{
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "acceptedPublishers": { }
}
```

**Response `200 OK` — Unconfirmed credentials:**

```json
{
  "token": null,
  "refreshToken": null
}
```

**Response `200 OK` — Multiple tenants found:**

```json
{
  "token": null,
  "associatedTenants": [
	{ "id": 1, "name": "Acme Corp", "status": "Active" }
  ]
}
```

---

### POST `api/account/externalLogin`

Performs an external (system-initiated) login on behalf of a tenant owner.

**Auth:** Bearer Token — requires **System** role

**Request Body:**

```json
{
  "tenantId": 1,
  "email": "user@example.com",
  "password": "string",
  "countryCode": "GR"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tenantId` | int | No | |
| `email` | string | Yes | |
| `password` | string | Yes | |
| `countryCode` | string | Yes | ISO country code, e.g. `GR` |

**Response `200 OK`:**

```json
{
  "token": "jwt-token",
  "tenantId": 1,
  "userId": "string"
}
```

---

### POST `api/account/logout`

Invalidates the current session (refresh token + optional FCM token).

**Auth:** Bearer Token

**Request Body:**

```json
{
  "refreshToken": "string",
  "fcmToken": "string"
}
```

| Field | Type | Required |
|---|---|---|
| `refreshToken` | string | No |
| `fcmToken` | string | No |

**Response:** No response body (fire-and-forget).

---

### POST `api/account/refreshToken`

Issues a new JWT access token using a valid refresh token.  
Requires the `IgnoreTokenExpiration` authentication scheme — send the **expired** access token.

**Auth:** Bearer Token (expired token accepted)

**Request Body:**

```json
{
  "refreshToken": "string",
  "fcmToken": "string"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `refreshToken` | string | Yes | |
| `fcmToken` | string | No | If refresh fails, this FCM token is deactivated |

**Response `200 OK`:**

```json
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

---

### POST `api/account/register`

Registers a new user and creates a new tenant.

**Auth:** Anonymous

**Request Body:**

```json
{
  "tenantName": "Acme Corp",
  "countryCode": "GR",
  "vat": "123456789",
  "email": "user@example.com",
  "password": "string",
  "referralCode": "REF123"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tenantName` | string | Yes | |
| `countryCode` | string | Yes | |
| `vat` | string | No | |
| `email` | string | Yes | |
| `password` | string | Yes | |
| `referralCode` | string | No | |

**Response:** `200 OK`

---

### POST `api/account/requestPasswordReset`

Sends a password reset OTP to the user's email.

**Auth:** Anonymous

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK` — no body

---

### POST `api/account/resendConfirmationEmail`

Resends the email confirmation link to the user.

**Auth:** Anonymous

**Request Body:**

```json
{
  "tenantId": 1,
  "email": "user@example.com",
  "password": "string"
}
```

**Response:** `200 OK` — no body

---

### POST `api/account/resetPassword`

Resets the user's password using the OTP received via email.

**Auth:** Anonymous

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": 123456
}
```

| Field | Type | Required |
|---|---|---|
| `email` | string | Yes |
| `otp` | int | Yes |

**Response:** `200 OK` — no body

---

### PUT `api/account/updateEmail`

Updates the email address of the authenticated user.

**Auth:** Bearer Token

**Request Body:**

```json
{
  "email": "new@example.com"
}
```

**Response:** `200 OK` — no body

---

### PUT `api/account/updatePassword`

Updates the password of the authenticated user.

**Auth:** Bearer Token

**Request Body:**

```json
{
  "currentPassword": "string",
  "updatedPassword": "string"
}
```

**Response:** `200 OK` — no body

---

## Referrals

**Base route:** `api/referrals`  
**Auth:** Bearer Token — requires **System** role (all endpoints)

---

### GET `api/referrals`

Returns a paginated list of all referrals.

**Query Parameters:**

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `pageIndex` | int | Yes | Default: 1 |
| `pageSize` | int | Yes | |
| `totalItemsCountRequired` | bool | No | If `true`, total count is included |

**Response `200 OK`:**

```json
{
  "referrals": [
	{
	  "id": 1,
	  "code": "REF123",
	  "firstName": "John",
	  "lastName": "Doe",
	  "phoneNumber": "+30 6900000000",
	  "email": "john@example.com",
	  "tenants": [
		{ "id": 1, "name": "Acme Corp" }
	  ]
	}
  ],
  "totalItems": 42
}
```

> `totalItems` is `null` when `totalItemsCountRequired` is `false`.

---

### GET `api/referrals/{referralId}`

Returns a single referral by ID, including its associated tenants.

**Path Parameters:**

| Parameter | Type | Required |
|---|---|---|
| `referralId` | int | Yes |

**Response `200 OK`:**

```json
{
  "id": 1,
  "code": "REF123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+30 6900000000",
  "email": "john@example.com",
  "tenants": [
	{ "id": 1, "name": "Acme Corp" }
  ]
}
```

**Response:** `404 Not Found` — if referral does not exist

---

### POST `api/referrals`

Creates a new referral.

**Request Body:**

```json
{
  "code": "REF123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+30 6900000000",
  "email": "john@example.com"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `code` | string | Yes | |
| `firstName` | string | Yes | |
| `lastName` | string | Yes | |
| `phoneNumber` | string | Yes | International format |
| `email` | string | Yes | |

**Response `200 OK`:** Returns the new referral's key (string).

---

### PUT `api/referrals`

Updates an existing referral.

**Request Body:**

```json
{
  "id": 1,
  "code": "REF123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+30 6900000000",
  "email": "john@example.com"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | int | Yes | Must be ≥ 1 |
| `code` | string | Yes | |
| `firstName` | string | Yes | |
| `lastName` | string | Yes | |
| `phoneNumber` | string | Yes | International format |
| `email` | string | Yes | |

**Response:** `200 OK` — no body

---

## Stripe

**Base route:** `api/stripe`

---

### POST `api/stripe/webhook`

Receives and processes incoming Stripe webhook events.  
The request body is read as raw text to allow Stripe signature validation via `Stripe-Signature` header.

**Auth:** Anonymous

**Headers:**

| Header | Required | Notes |
|---|---|---|
| `Stripe-Signature` | Yes | Provided by Stripe |

**Handled Events:**

| Event | Action |
|---|---|
| `checkout.session.completed` | Inserts a new active `TenantSubscription` for the tenant |
| `invoice.payment_succeeded` | Extends `CurrentPeriodEnd` on renewal. Acts as safety net if `checkout.session.completed` failed |

**Responses:**

| Code | Reason |
|---|---|
| `200 OK` | Event processed successfully |
| `400 Bad Request` | Invalid Stripe signature — event is rejected and will not be retried |
| `500 Internal Server Error` | DB or service failure — Stripe will automatically retry for up to 7 days |

---

### GET `api/stripe/products`

Returns all active Stripe products with their prices.

**Auth:** Bearer Token — requires **System** role

**Response `200 OK`:**

```json
[
  {
	"id": "prod_abc123",
	"name": "Pro Plan",
	"prices": [
	  {
		"id": "price_abc123",
		"amount": 2900,
		"currency": "eur",
		"interval": "month"
	  }
	]
  }
]
```

---

### POST `api/stripe/subscriptions`

Creates a Stripe Checkout Session and returns the hosted checkout URL to redirect the user to.

**Auth:** Bearer Token — requires **System** role

**Request Body:**

```json
{
  "tenantId": 1,
  "externalPriceId": "price_abc123"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tenantId` | int | Yes | Must be ≥ 1 |
| `externalPriceId` | string | Yes | Stripe Price ID |

**Response `200 OK`:** Returns the Stripe hosted checkout URL (string).

---

### PUT `api/stripe/subscriptions`

Upgrades the tenant's active Stripe subscription to a new price.  
Unused time on the current billing period is credited automatically via Stripe proration.

**Auth:** Bearer Token — requires **System** role

**Request Body:**

```json
{
  "tenantId": 1,
  "subscriptionExternalId": "sub_abc123",
  "newExternalPriceId": "price_xyz456"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tenantId` | int | Yes | Must be ≥ 1 |
| `subscriptionExternalId` | string | Yes | Stripe Subscription ID |
| `newExternalPriceId` | string | Yes | Target Stripe Price ID |

**Response:** `200 OK` — no body

---

### DELETE `api/stripe/subscriptions`

Cancels the tenant's active Stripe subscription immediately and issues a full refund for the unused period.

**Auth:** Bearer Token — requires **System** role

**Request Body:**

```json
{
  "tenantId": 1,
  "subscriptionExternalId": "sub_abc123"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tenantId` | int | Yes | Must be ≥ 1 |
| `subscriptionExternalId` | string | Yes | Stripe Subscription ID |

**Response:** `200 OK` — no body

---

## Summaries

**Base route:** `api/summaries`  
> ⚠️ Requires the **Summaries** module to be enabled for the tenant.  
> ⚠️ `DateTimeFrom` / `DateTimeTo` must be sent as **localized dates** (not UTC). Example: `2026-02-16`, not `2026-02-16T00:00:00Z`.

---

### GET `api/summaries/loyaltyPrograms`

Returns aggregated loyalty program summaries grouped by business day.

**Auth:** Bearer Token — requires `ViewLoyaltyProgramAnalytics` permission

**Query Parameters:**

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `dateTimeFrom` | DateTime | No | Localized date, e.g. `2026-02-01` |
| `dateTimeTo` | DateTime | No | Localized date, e.g. `2026-02-28` |
| `groupIds` | int[] | No | Filter by group IDs |
| `loyaltyProgramIds` | int[] | No | Filter by loyalty program IDs |

**Response `200 OK`:**

```json
[
  {
	"creationDate": "2026-02-16",
	"entries": [ ]
  }
]
```

---

### GET `api/summaries/operations`

Returns aggregated operation summaries grouped by business day.

**Auth:** Bearer Token — requires `ViewOperatorAnalytics` permission

**Query Parameters:**

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `dateTimeFrom` | DateTime | No | Localized date, e.g. `2026-02-01` |
| `dateTimeTo` | DateTime | No | Localized date, e.g. `2026-02-28` |
| `groupIds` | int[] | No | Filter by group IDs |
| `operatorIds` | long[] | No | Filter by operator IDs |

**Response `200 OK`:**

```json
[
  {
	"creationDate": "2026-02-16",
	"entries": [ ]
  }
]
```
