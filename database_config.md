# MongoDB Atlas Database Configuration

## ✅ Database Status: ACTIVE
Your MongoDB Atlas cluster is resumed and accessible via MongoDB Compass.

**Cluster Details:**
- Cluster URL: `cluster0.5ucr1fl.mongodb.net`
- Database Name: `nextportfolio`
- Status: Connected ✅

## Collections Found:
- payload-migrations
- payload-preferences
- projects
- skills
- users
- experiences
- media
- pages

## Configuration Steps:

### 1. Get Connection String from Atlas
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on Cluster0
3. Choose "Connect your application"
4. Copy the connection string

### 2. Create .env.local file
Create a `.env.local` file in your project root with:

```env
# MongoDB Atlas Connection
DATABASE_URL="mongodb+srv://your-username:your-password@cluster0.5ucr1fl.mongodb.net/nextportfolio?retryWrites=true&w=majority"

# Email configuration for Resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_ADDRESS_FROM=your-email@example.com

# Voice AI (Vapi) configuration  
VAPI_PUBLIC_KEY=b42e5bf6-ca87-4564-9c03-7beef93c25e3
VAPI_AGENT_ID=e9675026-b11b-4615-b4f0-8fd1fe5a87a6
```

### 3. Replace Placeholders
- Replace `your-username` with your Atlas username
- Replace `your-password` with your Atlas password
- Keep the database name as `nextportfolio` (as shown in Compass)

### 4. Test Connection
Run your application to test the database connection:
```bash
npm run dev
```

## Security Note:
- Never commit `.env.local` to version control
- The `.env.local` file is already in your `.gitignore` 