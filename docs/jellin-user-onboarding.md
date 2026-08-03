# Jellin User Onboarding

## Introduction
Jellin user onboarding is designed to be seamless and secure. Users receive onboarding instructions and information about available application packages on the static website. All registration, subscription purchase, and payment processing are handled by the Jellin backend. The mobile app is used only for login/logout and adapts its behavior based on the user status fetched from the backend. The app does not handle registration or onboarding directly.

# Adapty Integration Guide

## 1. General Functionality of Adapty
Adapty is a subscription management platform that enables apps and websites to sell, manage, and analyze in-app purchases and subscriptions. It provides SDKs and APIs for integrating subscription flows, handling entitlements, and synchronizing user purchases across platforms (web, iOS, Android).

Key features:
- Subscription purchase and management (web and mobile)
- User entitlement tracking
- Analytics and reporting
- Webhooks and REST API for backend integration


## Stripe (or Other Payment Gateway) Integration

Adapty does not directly process payments through Stripe or other payment gateways for web purchases. Instead, your backend is responsible for handling the payment and then notifying Adapty of the successful purchase.

**Integration Flow:**
- The website uses Stripe (or another gateway) to process the payment.
- After a successful payment, your backend receives confirmation from Stripe (usually via webhook or API callback).
- Your backend then calls Adapty’s REST API to register the purchase and update the user’s subscription status.
- Adapty manages entitlements, analytics, and syncs the subscription status for your app.

**Key Point:**
Adapty and Stripe do not communicate directly. Your backend acts as the bridge between the payment gateway and Adapty.

**Backend Responsibilities:**
- Handle payment confirmation from Stripe (or other gateway).
- Inform Adapty of the purchase using their REST API.

This ensures that subscription status is consistent across your website and app, and that Adapty can manage entitlements and analytics effectively.



## 2. Unified Jellin User Onboarding Flow (with Stripe & Adapty)

### Overview
This architecture enables users to view onboarding instructions and available application packages on a static website. Users complete registration and subscription purchase through the backend (e.g., via a web portal or API). The backend manages user accounts, payment processing (via Stripe), and Adapty integration. The mobile app is used only for login/logout and adapts its behavior based on the user status fetched from the backend.

### Components
- **Website**: Static HTML page that provides onboarding instructions and informs users about available application offers/packages. No registration or purchase functionality.
- **Backend (C#)**: Central service for user registration, payment processing (Stripe), Adapty API integration, and subscription status tracking
- **Mobile App**: Used only for login/logout; fetches user status from backend and adapts its behavior accordingly
- **Stripe**: Payment gateway for processing user payments
- **Adapty**: Handles subscription processing, entitlements, and analytics

### Unified Onboarding & Subscription Flow
1. User visits the static website to learn about Jellin's application offers/packages and receives onboarding instructions.
2. User completes registration and subscription purchase through the backend (e.g., via a web portal or API; not in the mobile app).
3. The backend processes payment with Stripe and, upon success, updates the user's subscription status and notifies Adapty via their REST API.
4. User downloads and opens the Jellin mobile app.
5. User logs in to the app; the app fetches user status from the backend.
6. The app adapts its behavior and unlocks features based on the user status provided by the backend.

### Diagram

```
User <-> Static Website (info & instructions)
          |
          v
    Backend (C#) <-> Stripe
          |
          v
      Adapty
          ^
          |
    Mobile App (login/logout, fetches user status)
```



## 3. Code Examples

### Backend (C#) — Stripe Payment Confirmation & Adapty Integration
Below is a simplified example of how your backend might handle a Stripe webhook for payment confirmation and then update Adapty:

```csharp
// Stripe webhook handler (ASP.NET Core example)
[ApiController]
[Route("api/webhooks/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly AdaptyService _adaptyService;
    private readonly IUserService _userService;

    public StripeWebhookController(AdaptyService adaptyService, IUserService userService)
    {
        _adaptyService = adaptyService;
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> HandleStripeEvent()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], "YOUR_STRIPE_WEBHOOK_SECRET");

        if (stripeEvent.Type == Events.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
            var userId = session.ClientReferenceId;
            var adaptyUserId = _userService.GetAdaptyUserId(userId);

            // Update user subscription status in your DB
            await _userService.ActivateSubscription(userId, session.SubscriptionId);

            // Notify Adapty
            await _adaptyService.CreateOrUpdateUserAsync(adaptyUserId, session.CustomerEmail);
            // Optionally, update Adapty with purchase info if needed
        }

        return Ok();
    }
}
```

**Note:**
- Use the official Stripe .NET library for webhook parsing and event validation.
- The AdaptyService is as shown in previous examples.
- Always validate and secure your webhook endpoints.

### Mobile App (Login & Fetch User Status)
// Pseudocode for mobile app behavior
```pseudo
// User opens app
userLogsIn()
userStatus = backend.getUserStatus(userId)
if userStatus.activeSubscription:
    unlockFeaturesForUser()
else:
    showSubscriptionRequiredMessage()
```

### C# Backend (AdaptyService Example)
```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

public class AdaptyService
{
    private readonly HttpClient _httpClient;
    private readonly string _adaptyApiKey;

    public AdaptyService(string adaptyApiKey)
    {
        _adaptyApiKey = adaptyApiKey;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Api-Key", _adaptyApiKey);
        _httpClient.BaseAddress = new Uri("https://api.adapty.io/api/v1/");
    }

    public async Task<JObject> GetUserProfileAsync(string adaptyUserId)
    {
        var response = await _httpClient.GetAsync($"profiles/{adaptyUserId}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        return JObject.Parse(content);
    }

    public async Task<JObject> CreateOrUpdateUserAsync(string adaptyUserId, string email)
    {
        var payload = new
        {
            profile = new {
                customer_user_id = adaptyUserId,
                email = email
            }
        };
        var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(payload), System.Text.Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("profiles", content);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadAsStringAsync();
        return JObject.Parse(result);
    }
}
```

**Usage Example:**
```csharp
var adaptyService = new AdaptyService("YOUR_ADAPTY_API_KEY");
var adaptyUserId = "user-123";
var email = "user@example.com";
await adaptyService.CreateOrUpdateUserAsync(adaptyUserId, email);
var profile = await adaptyService.GetUserProfileAsync(adaptyUserId);
var subscriptions = profile["data"]?["profile"]?["subscriptions"];
```

---

**References:**
- [Adapty REST API](https://docs.adapty.io/docs/api-overview)
- [Adapty User Management](https://docs.adapty.io/docs/user-management)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe .NET API Reference](https://stripe.com/docs/api/dotnet)


## Addendum: 0% Charge from Google Play / App Store

### Why This Architecture Enables 0% Platform Fees
The described architecture ensures that all user onboarding, registration, and subscription purchases for Jellin occur outside of the Google Play Store and Apple App Store ecosystems. Users are directed to complete purchases via the backend (using Stripe or other payment processors) and not through in-app purchases (IAP) on the mobile app. This means:

- No digital goods or subscriptions are sold via Google Play Billing or Apple In-App Purchase APIs.
- All payment processing and subscription management are handled externally, through your backend and web-based flows.
- The mobile app only checks user status from the backend and does not facilitate or link to in-app purchases.

As a result, Google and Apple do not process or take a commission on any Jellin sales, resulting in a 0% platform fee for these transactions.

### Handling User Communication in the Mobile App
To remain compliant and avoid triggering platform fees or app review issues:

- **Do not offer, advertise, or link to external purchase flows within the app UI.**
- **Do not mention pricing, purchase options, or direct users to the website for payment within the app.**
- The app should only display the user's current subscription status and entitlements as provided by the backend.
- If a user does not have an active subscription, show a neutral message such as: "No active subscription found. Please visit our website for more information."
- Avoid using language that encourages or instructs users to make purchases outside the app.

**Summary:**
By keeping all purchase flows outside the app and not referencing them in the app UI, you avoid Google Play and App Store fees and remain compliant with their guidelines.