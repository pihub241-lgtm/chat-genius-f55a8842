# Chat Genius Backend

Express.js backend with Google OAuth and ChatGPT integration.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env    # Then fill in your API keys
node server.js          # Server starts on http://localhost:5000
```

## Environment Variables

| Variable | Where to get it |
|---|---|
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client IDs |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or select existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set **Authorized redirect URI** to: `http://localhost:5000/auth/google/callback`
6. Copy the Client ID and Client Secret into your `.env`

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/auth/google` | Start Google login |
| GET | `/auth/user` | Get current user |
| GET | `/auth/logout` | Log out |
| POST | `/chat/message` | Send message to ChatGPT |

### Chat Example

```bash
curl -X POST http://localhost:5000/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "history": []}'
```

## Frontend Integration

In your React app, call the backend like:

```js
// Login: redirect to
window.location.href = "http://localhost:5000/auth/google";

// Chat: POST request
const res = await fetch("http://localhost:5000/chat/message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ message: "Hello!", history: [] }),
});
const data = await res.json(); // { reply: "..." }
```
