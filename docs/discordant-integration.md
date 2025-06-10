# Discordant Integration Setup Guide

## Overview
This guide covers the complete setup of Discordant integration with your portfolio site, including chat widgets, VAPI integration, and n8n workflow automation.

## Environment Variables

Add these to your `.env.local` file:

```bash
# Discordant Integration
DISCORDANT_API_TOKEN=disc_your_api_token_here
DISCORDANT_BASE_URL=https://your-discordant-instance.com
DISCORDANT_PORTFOLIO_CHANNEL_ID=portfolio-inquiries-channel-id
DISCORDANT_VAPI_CHANNEL_ID=vapi-conversations-channel-id

# Public Discordant URLs (for client-side components)
NEXT_PUBLIC_DISCORDANT_URL=https://your-discordant-instance.com
NEXT_PUBLIC_DISCORDANT_PORTFOLIO_CHANNEL_ID=portfolio-inquiries-channel-id

# Optional: Direct n8n integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/portfolio-contact
```

## Step 1: Create Discordant API Token

1. Go to your Discordant admin interface
2. Navigate to **External Integrations** → **API Tokens**
3. Click **Create Token**
4. Configure as follows:

```json
{
  "name": "Portfolio Integration",
  "type": "SERVICE_ACCOUNT",
  "serverId": "your-server-id",
  "channelIds": ["portfolio-inquiries", "vapi-conversations"],
  "permissions": {
    "canSendMessages": true,
    "canCreateAgents": true,
    "canReadMessages": true
  },
  "sourceOrigin": "https://your-portfolio.com",
  "rateLimit": 100,
  "rateLimitWindow": 3600
}
```

5. Save the generated token as `DISCORDANT_API_TOKEN`

## Step 2: Setup Discordant Channels

### Create Portfolio Channels
1. **portfolio-inquiries** - For contact forms and general chat
2. **vapi-conversations** - For voice call transcripts
3. **portfolio-admin** - For system notifications (optional)

### Configure Channel Permissions
- Allow external API posting
- Enable webhook forwarding to n8n
- Set up real-time event subscriptions

## Step 3: Create Agent Users

Run this setup command to create the required agent users:

```typescript
// In your admin interface or setup script
import { discordantClient } from '@/lib/discordant-client';

await discordantClient.setupPortfolioAgents();
```

This creates:
- **Portfolio AI Assistant** - For n8n workflow responses
- **VAPI Voice Assistant** - For voice call processing
- **Portfolio System** - For system notifications

## Step 4: Configure n8n Workflow

### Update n8n Webhook URL
In your existing n8n workflow, update the webhook trigger to accept messages from Discordant:

```javascript
// Expected payload from Discordant
{
  "message": "User message content",
  "userId": "visitor-session-id",
  "channelId": "portfolio-inquiries",
  "userName": "John Doe",
  "serverId": "your-server-id",
  "sourceType": "contact-form",
  "visitorData": {
    "email": "john@example.com",
    "sessionId": "unique-session-id",
    "metadata": { "page": "/contact" }
  }
}
```

### Setup Response Webhook
Configure n8n to send responses back to Discordant:

```javascript
// POST https://your-discordant.com/api/external/webhook/n8n
{
  "externalMessageId": "original-message-id",
  "agentResponse": {
    "content": "AI response content",
    "type": "markdown"
  },
  "workflowId": "portfolio-ai-assistant",
  "processingTime": 1500
}
```

## Step 5: Add Chat Widget to Pages

### Contact Page
```tsx
import { ContactPageChatWidget } from '@/components/discordant-chat-widget';

export default function ContactPage() {
  return (
    <div>
      {/* Your existing content */}
      <ContactPageChatWidget />
    </div>
  );
}
```

### Global Chat Widget
Add to your root layout:

```tsx
import DiscordantChatWidget from '@/components/discordant-chat-widget';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <DiscordantChatWidget />
      </body>
    </html>
  );
}
```

## Step 6: Configure VAPI Integration

### Update VAPI Webhook URL
In your VAPI dashboard, set the webhook URL to:
```
https://your-portfolio.com/api/vapi/webhook
```

### VAPI Event Flow
1. **Call Start** → Creates visitor session + Discordant notification
2. **Transcript** → Real-time streaming to Discordant chat
3. **Call End** → Full transcript sent to Discordant → Triggers n8n workflow

## Step 7: Test Integration

### Test Contact Form
1. Fill out contact form on your portfolio
2. Check Discordant for new message in `portfolio-inquiries` channel
3. Verify n8n workflow triggers
4. Confirm AI response appears in Discordant

### Test VAPI Integration
1. Make a test VAPI call
2. Check `vapi-conversations` channel for transcript
3. Verify call summary triggers workflow
4. Confirm follow-up actions are created

### Test Chat Widget
1. Open chat widget on portfolio
2. Send a test message
3. Verify message appears in Discordant
4. Check for AI response via n8n

## Configuration Options

### Chat Widget Customization
```tsx
<DiscordantChatWidget
  theme="dark"
  position="bottom-left"
  title="Ask about my projects"
  channelId="specific-channel-id"
/>
```

### Session Management
The system automatically tracks:
- Visitor sessions across pages
- Identity capture (name/email from forms)
- Page navigation and interaction history
- Integration with authenticated users

## Troubleshooting

### Common Issues

#### 1. Chat Widget Not Loading
- Check `NEXT_PUBLIC_DISCORDANT_URL` is set correctly
- Verify channel permissions allow external access
- Check browser console for CORS errors

#### 2. Contact Form Not Triggering n8n
- Verify webhook URL in Discordant settings
- Check n8n webhook is accepting requests
- Review Discordant → n8n forwarding configuration

#### 3. VAPI Transcripts Not Appearing
- Confirm VAPI webhook URL is correct
- Check visitor session creation in database
- Verify Discordant API token permissions

#### 4. Real-time Events Not Working
- Check socket connection to Discordant
- Verify event subscriptions are configured
- Review browser network tab for socket errors

### Debug Mode
Enable debug logging:

```bash
# Add to your .env.local
DEBUG=discordant:*
```

## Security Considerations

1. **API Token Security**
   - Store tokens in environment variables only
   - Rotate tokens regularly
   - Use origin restrictions

2. **Channel Permissions**
   - Limit external posting to specific channels
   - Configure read/write permissions appropriately
   - Monitor API usage and rate limits

3. **Visitor Data**
   - Follow GDPR/privacy regulations
   - Implement data retention policies
   - Provide clear privacy notices

## Next Steps

1. **Analytics Integration** - Track conversation metrics
2. **Advanced Workflows** - Create specialized n8n flows for different interaction types
3. **Multi-Channel Support** - Expand to other communication channels
4. **AI Enhancements** - Improve response quality and context awareness

## Support

For issues with:
- **Discordant Integration**: Check Discordant admin logs and API responses
- **n8n Workflows**: Review n8n execution logs and webhook delivery
- **Portfolio Issues**: Check browser console and Next.js server logs 