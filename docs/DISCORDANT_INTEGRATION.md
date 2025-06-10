# Discordant Integration for Portfolio Website

## Overview

This document outlines the integration between the Portfolio website and the [Discordant](https://github.com/kendevco/discordant) platform for seamless chat functionality, user management, and n8n workflow automation.

## Architecture

### Integration Flow
```
Website Visitor → Portfolio Chat → Discordant API → Discord Channel → n8n Workflow → Response
```

### Key Components

1. **Website Visitor Management**: Automatic user creation and session tracking
2. **Server/Channel Selection**: Dynamic discovery and configuration
3. **Message Routing**: Direct integration with Discordant message system
4. **n8n Integration**: Workflow automation identical to Discordant's pattern
5. **Admin Configuration**: Full management interface for integration settings

## Database Schema

### New Models Added

```typescript
model DiscordantIntegration {
  id                String   @id @default(cuid()) @map("_id")
  discordantBaseUrl String   // https://discordant.kendev.co
  apiToken          String   // API authentication token
  serverId          String?  // Default server ID (optional)
  serverName        String?  // Display name for server
  channelId         String?  // Default channel ID (optional)
  channelName       String?  // Display name for channel
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model WebsiteVisitor {
  id              String    @id @default(cuid()) @map("_id")
  sessionId       String    @unique // Unique session identifier
  discordantUserId String?  // Linked Discordant user ID
  name            String?   // Visitor name (optional)
  email           String?   // Visitor email (optional)
  ipAddress       String?   // Visitor IP (optional)
  userAgent       String?   // Browser info
  isActive        Boolean   @default(true)
  lastSeen        DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  messages        ChatMessage[]
}

model ChatMessage {
  id                String         @id @default(cuid()) @map("_id")
  content           String         // Message content
  fileUrl           String?        // Optional file attachment
  websiteVisitorId  String         // Foreign key to WebsiteVisitor
  visitor           WebsiteVisitor @relation(fields: [websiteVisitorId], references: [id], onDelete: Cascade)
  discordantMessageId String?      // Linked Discordant message ID
  n8nWorkflowId     String?        // n8n workflow identifier
  n8nExecutionId    String?        // n8n execution ID
  isFromAI          Boolean        @default(false)
  metadata          Json?          // Additional data
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  @@index([websiteVisitorId])
  @@index([createdAt])
}
```

## API Endpoints

### Integration Management
- `GET /api/discordant/integrations` - List all integrations
- `POST /api/discordant/integrations` - Create new integration
- `PUT /api/discordant/integrations/[id]` - Update integration
- `DELETE /api/discordant/integrations/[id]` - Delete integration

### Discordant Communication
- `GET /api/discordant/servers` - Fetch available servers
- `GET /api/discordant/channels?serverId=xxx` - Fetch channels for server
- `POST /api/discordant/message` - Send message to Discordant

## Website Visitor Workflow

### 1. Session Creation
When a visitor opens the chat:
```typescript
const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```

### 2. User Creation in Discordant
On first message, create user in Discordant:
```typescript
const discordantUserResponse = await fetch(`${baseUrl}/api/website-visitors`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sessionId,
    name: "Website Visitor",
    email: visitorEmail,
    serverId: selectedServerId
  })
});
```

### 3. Message Flow
1. **User sends message** → Portfolio chat interface
2. **Message stored** → Local ChatMessage record
3. **Forwarded to Discordant** → Server/Channel via API
4. **n8n triggered** → Webhook with full context
5. **Response processed** → Back through Discordant → Portfolio

## Discordant API Requirements

### Expected Endpoints in Discordant

```typescript
// Health check
GET /api/health
Headers: Authorization: Bearer {token}

// Server management
GET /api/servers
Headers: Authorization: Bearer {token}

// Channel management  
GET /api/servers/{serverId}/channels
Headers: Authorization: Bearer {token}

// Website visitor management
POST /api/website-visitors
Headers: Authorization: Bearer {token}
Body: { sessionId, name, email, serverId }

// Message sending
POST /api/servers/{serverId}/channels/{channelId}/messages
Headers: Authorization: Bearer {token}
Body: { 
  content: string,
  userId: string,
  metadata: {
    source: "website_chat",
    sessionId: string,
    timestamp: string
  }
}
```

## n8n Integration

### Webhook Payload Structure
```json
{
  "message": "User's message content",
  "sessionId": "session_1234567890_abc123",
  "visitor": {
    "id": "visitor_id",
    "name": "Website Visitor", 
    "email": "visitor@example.com"
  },
  "discordant": {
    "serverId": "server_id",
    "channelId": "channel_id", 
    "messageId": "discordant_message_id"
  },
  "metadata": {
    "source": "portfolio_website",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Handling
n8n workflows should return:
```json
{
  "workflowId": "workflow_identifier",
  "executionId": "execution_id", 
  "response": "AI generated response text"
}
```

## Admin Configuration

### Setup Process
1. **Navigate to Admin Panel** → `/admin/discordant`
2. **Create Integration**:
   - Discordant Base URL: `https://discordant.kendev.co`
   - API Token: Generate in Discordant admin
   - Default Server/Channel: Optional presets
3. **Test Connection** → Validates API access
4. **Activate Integration** → Only one can be active

### KenDev Home Portal Setup
Pre-configured template:
- Server: "KenDev Home Portal"
- Channel: "website-visitors" 
- Auto-discovery of actual IDs

## Environment Variables

Add to `.env`:
```bash
# Discordant Integration
DISCORDANT_BASE_URL=https://discordant.kendev.co
DISCORDANT_API_TOKEN=your_api_token

# n8n Integration (existing)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/portfolio-chat
```

## Best Practices

### User Management
- **Session-based identification**: No forced registration
- **Automatic user creation**: Seamless first experience
- **Persistent sessions**: Return visitors maintain context
- **Grace period**: 30-day visitor retention

### Channel Organization
- **Dedicated website channel**: `#website-visitors`
- **Organized by source**: Different channels per website section
- **Thread-based conversations**: Group messages by session
- **Automated archiving**: Old conversations auto-archived

### Message Handling
- **Rich metadata**: Include full context with every message
- **File support**: Images and documents through UploadThing
- **Error handling**: Graceful fallbacks when Discordant unavailable
- **Rate limiting**: Prevent spam and abuse

### Security Considerations
- **API token rotation**: Regular token updates
- **IP whitelisting**: Restrict API access
- **Input sanitization**: Clean all user inputs
- **HTTPS only**: Encrypted communication
- **Session validation**: Prevent session hijacking

## Integration Testing

### Manual Testing Checklist
- [ ] Chat button appears on website
- [ ] Server/channel selection works
- [ ] Messages send to correct Discordant channel
- [ ] n8n workflows trigger properly
- [ ] Error handling works (Discordant offline)
- [ ] Admin configuration persists
- [ ] Multi-visitor sessions work independently

### API Testing
```bash
# Test Discordant connection
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://discordant.kendev.co/api/health

# Test server listing
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://discordant.kendev.co/api/servers

# Test message sending
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"content":"Test message","userId":"test_user"}' \
     https://discordant.kendev.co/api/servers/SERVER_ID/channels/CHANNEL_ID/messages
```

## Troubleshooting

### Common Issues

1. **"No active Discordant integration found"**
   - Check admin panel → `/admin/discordant`
   - Ensure integration is marked as active

2. **"Failed to load servers"**
   - Verify API token in integration settings
   - Check Discordant server is accessible
   - Confirm API endpoints exist

3. **Messages not appearing in Discord**
   - Verify server/channel IDs are correct
   - Check Discordant logs for errors
   - Ensure user has proper permissions

4. **n8n workflow not triggering**
   - Verify webhook URL in environment variables
   - Check n8n webhook node configuration
   - Confirm webhook is active and accessible

## Future Enhancements

### Planned Features
1. **Real-time messaging**: WebSocket integration for live updates
2. **File upload support**: Direct integration with UploadThing
3. **Visitor analytics**: Comprehensive engagement tracking
4. **Multi-language support**: Internationalization ready
5. **Voice message support**: Audio recording and playback
6. **Screen sharing**: Integration with LiveKit for support sessions

### Advanced Integration
1. **CRM sync**: Automatic lead capture and qualification
2. **Calendar integration**: Meeting scheduling through chat
3. **Knowledge base**: AI-powered FAQ and documentation search
4. **Sentiment analysis**: Automatic mood detection and routing
5. **Performance metrics**: Response time and satisfaction tracking

## Conclusion

This integration creates a seamless bridge between your portfolio website and the Discordant platform, enabling:
- **Professional chat experience** for website visitors
- **Automated workflow processing** through n8n
- **Centralized communication** in your Discord server
- **Scalable visitor management** with full admin control

The implementation follows Discordant's existing patterns while adding portfolio-specific enhancements for optimal user experience and administrative control. 