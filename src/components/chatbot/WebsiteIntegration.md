# Website Integration Guide

## How to Add the Chatbot to Your Website

### 1. Simple JavaScript Snippet

Add the following code to your website's HTML, just before the closing `</body>` tag:

```html
<script>
  window.boltzConfig = {
    chatbotId: "YOUR_CHATBOT_ID",
    position: "bottom-right", // Options: bottom-right, bottom-left
    theme: "light", // Options: light, dark, auto (follows user's system preference)
    initialMessage: "Hello! How can I help you today?",
    avatar: true, // Show or hide the bot avatar
    branding: true // Show or hide Boltz.co branding
  }
</script>
<script src="https://cdn.boltz.co/widget.js" async></script>
```

Replace `YOUR_CHATBOT_ID` with the unique ID of your chatbot from your dashboard.

### 2. CMS Platform Integrations

#### WordPress

1. Install the Boltz.co WordPress plugin from the WordPress plugin directory
2. Navigate to the Boltz.co settings page in your WordPress admin panel
3. Enter your chatbot ID and customize appearance settings
4. Save changes and the chatbot will appear on your site

#### Shopify

1. Visit the Shopify App Store and install the Boltz.co app
2. Follow the setup wizard to connect your Boltz.co account
3. Select the chatbot you want to display on your store
4. Customize appearance settings and save

#### Wix

1. Go to the Wix App Market and add the Boltz.co app
2. Connect your Boltz.co account
3. Configure your chatbot settings
4. Publish your site to make the changes live

#### Webflow

1. Add a custom code element to your site
2. Paste the JavaScript snippet provided above
3. Publish your site to make the changes live

### 3. Advanced Integration with API

For more advanced use cases, you can use our REST API to programmatically control the chatbot:

```javascript
// Initialize the chatbot
const boltzChat = new BoltzChat('YOUR_API_KEY');

// Open the chat programmatically
document.querySelector('#support-button').addEventListener('click', () => {
  boltzChat.open();
});

// Send a custom event
boltzChat.sendEvent({
  type: 'product_view',
  data: {
    productId: '12345',
    productName: 'Premium Plan',
    price: 99.99
  }
});

// Set user identity
boltzChat.setUser({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  custom: {
    plan: 'premium',
    signupDate: '2023-01-15'
  }
});
```

## How the Chatbot Searches Your Website

### 1. Initial Website Crawling

When you first connect your website to Boltz.co, our system performs an initial crawl of your site to:

- Index all public pages
- Extract product information
- Identify key content sections
- Build a knowledge base from your content

This process typically takes a few minutes for small sites and up to a few hours for larger sites.

### 2. Structured Data Support

To improve the chatbot's ability to understand your products and content, we recommend adding structured data markup to your website:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Premium Plan",
  "description": "Our most popular plan with all features included.",
  "image": "https://example.com/images/premium-plan.jpg",
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 3. Real-time Search

When a user asks about products or services, the chatbot:

1. Analyzes the user's query using NLP
2. Searches the indexed content for relevant information
3. Retrieves product details, pricing, and availability
4. Presents the information in a conversational format
5. Can display interactive product cards with images and action buttons

### 4. Dynamic Content Updates

The chatbot stays up-to-date with your website content through:

- Regular re-crawling (configurable frequency)
- Webhook notifications when content changes
- API-based content synchronization
- Real-time inventory checks for e-commerce sites

## E-commerce Integration

### Product Search and Display

When a user asks about products, the chatbot can:

1. Display product cards with images, prices, and descriptions
2. Show product variants (sizes, colors, etc.)
3. Filter products based on user preferences
4. Compare multiple products side-by-side
5. Check inventory and availability

### Shopping Cart Integration

The chatbot can help users manage their shopping cart:

1. Add items to cart
2. Update quantities
3. Apply discount codes
4. View cart contents
5. Proceed to checkout

### Secure Checkout

For secure transactions, the chatbot can:

1. Redirect to your secure checkout page
2. Process payments through your existing payment gateway
3. Use tokenized payment methods for returning customers
4. Comply with PCI DSS requirements
5. Support various payment methods (credit cards, PayPal, etc.)

## Banking Integration

### Secure Authentication

Before any financial transactions, the chatbot ensures secure authentication:

1. Multi-factor authentication (MFA)
2. Biometric verification (when available)
3. One-time passwords (OTP)
4. Secure session management
5. Timeout for inactive sessions

### Identity Verification

For KYC (Know Your Customer) compliance:

1. Document verification (ID, passport, etc.)
2. Facial recognition matching
3. Address verification
4. Anti-fraud checks
5. Compliance with financial regulations

### Transaction Processing

Once authenticated, users can:

1. Check account balances
2. View transaction history
3. Transfer funds between accounts
4. Pay bills and invoices
5. Set up recurring payments

### Security Measures

All financial transactions are protected by:

1. End-to-end encryption
2. Tokenization of sensitive data
3. Secure API connections with banking partners
4. Audit logging for all transactions
5. Compliance with financial regulations (PSD2, Open Banking)

## Best Practices

1. **Keep your knowledge base updated** - Regularly review and update your chatbot's knowledge base to ensure it has the latest information.

2. **Use structured data** - Implement schema.org markup on your website to help the chatbot better understand your content.

3. **Train your chatbot** - Regularly review conversations and train your chatbot on common questions and edge cases.

4. **Set up human handoff** - Configure when and how conversations should be transferred to human agents.

5. **Monitor analytics** - Use the analytics dashboard to identify areas for improvement and optimize your chatbot's performance.