# 🚀 Quick Integration Setup

## 🎯 **Goal: Get Portfolio → Discordant → n8n → Discordant Working**

### **Step 1: Environment Variables**

Add these to your portfolio `.env.local`:

```bash
# Basic Discordant Integration
DISCORDANT_API_TOKEN=disc_[from_discordant_migration]
DISCORDANT_BASE_URL=http://localhost:3000
DISCORDANT_PORTFOLIO_CHANNEL_ID=[channel_id_from_discordant]
```

### **Step 2: Start Services**

1. **Start Discordant** (port 3000):
   ```bash
   cd /path/to/discordant
   npm run dev
   ```

2. **Start Portfolio** (port 3001):
   ```bash
   cd /path/to/portfolio
   npm run dev
   ```

### **Step 3: Test Integration**

1. Go to: `http://localhost:3001/test-integration`
2. Check environment status is green ✅
3. Send test message
4. Verify message appears in Discordant channel
5. Check n8n.kendev.co workflow is triggered

### **Step 4: Configure n8n Webhook**

In your n8n.kendev.co workflow:
- **Webhook URL**: `http://localhost:3000/api/external/webhook/n8n`
- **Method**: POST
- **Expected payload**: External message data from Discordant

### **Expected Flow**

```
Portfolio Test Page 
    ↓ POST /api/test-discordant
Discordant /api/external/messages
    ↓ forwards to
n8n.kendev.co webhook
    ↓ AI processing
n8n sends response back to Discordant
    ↓ real-time update
Discordant channel shows AI response
```

### **Troubleshooting**

#### ❌ "Missing API Token"
- Check your Discordant migration output for the token
- Ensure it starts with `disc_`

#### ❌ "Channel Not Found"
- Create a channel in Discordant
- Copy the channel ID from Discordant admin

#### ❌ "Connection Refused"
- Ensure Discordant is running on port 3000
- Check `DISCORDANT_BASE_URL` matches your running instance

#### ❌ "n8n Not Triggered"
- Verify webhook URL in n8n points to your Discordant instance
- Check Discordant logs for webhook forwarding

### **Success Indicators**

✅ Environment status shows all green  
✅ Test message returns success  
✅ Message appears in Discordant channel  
✅ n8n workflow executes  
✅ AI response appears in Discordant  

Once this basic flow works, we can enhance with:
- Contact form integration
- Chat widget
- VAPI integration
- Real-time responses back to portfolio 