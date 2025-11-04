# Bluesky Client

An experimental Bluesky client built with React, TypeScript, and the AT Protocol SDK. This is a sandbox for experimenting with UI patterns for consuming social media.

## Features

- ✅ **Authentication** - Login with your Bluesky credentials (app password)
- ✅ **Timeline Feed** - View your personalized timeline
- ✅ **Session Persistence** - Stay logged in across page refreshes
- ✅ **Responsive UI** - Clean, modern interface built with Tailwind CSS
- 🚧 **OAuth 2.0** - Coming soon (see OAuth section below)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **@atproto/api** - Official AT Protocol SDK
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Bluesky account

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Creating an App Password

Since this client uses password-based authentication, you'll need to create an app password:

1. Go to [Bluesky Settings](https://bsky.app/settings)
2. Navigate to "App Passwords"
3. Click "Add App Password"
4. Give it a name (e.g., "Dev Client")
5. Copy the generated password (format: `xxxx-xxxx-xxxx-xxxx`)
6. Use this password to login (NOT your main account password)

### First Login

1. Open the app
2. Enter your Bluesky handle (e.g., `yourname.bsky.social`) or email
3. Enter your app password
4. Click "Sign In"

Your session will be saved in localStorage, so you'll stay logged in.

## OAuth 2.0 Implementation Plan

Currently, this client uses password-based authentication for simplicity. Here's the plan for implementing full OAuth 2.0:

### Why OAuth is Tricky

OAuth for AT Protocol requires:

1. **Client Registration** - You need to register your app with Bluesky/PDS
   - Requires a redirect URI (challenging for localhost dev)
   - Need to handle production vs development URLs

2. **PKCE Flow** - OAuth with Proof Key for Code Exchange
   - Generate code verifier and challenge
   - Handle authorization redirect
   - Exchange code for tokens

3. **Token Management**
   - Store access and refresh tokens securely
   - Implement token refresh logic
   - Handle token expiration

4. **Redirect Handling**
   - Set up callback route (`/callback`)
   - Parse authorization code from URL
   - Complete the OAuth handshake

### Implementation Roadmap

- [ ] Register OAuth client with Bluesky
- [ ] Implement PKCE code generation
- [ ] Create OAuth authorization flow
- [ ] Build callback handler
- [ ] Add token refresh logic
- [ ] Implement secure token storage
- [ ] Add OAuth/password toggle

### References

- [AT Protocol OAuth Spec](https://atproto.com/specs/oauth)
- [@atproto/oauth-client](https://www.npmjs.com/package/@atproto/oauth-client)
- [Bluesky OAuth Guide](https://docs.bsky.app/docs/advanced-guides/oauth-client)

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx    # Route guard for authenticated pages
├── context/
│   └── AuthContext.tsx        # React context for auth state
├── pages/
│   ├── Login.tsx              # Login page
│   └── Feed.tsx               # Timeline feed viewer
├── services/
│   └── auth.ts                # Authentication service (AT Protocol)
├── types/
│   └── auth.ts                # TypeScript types
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

## Experimentation Ideas

This is a sandbox for UI experiments. Some ideas:

- **Alternative Feed Layouts** - Grid view, masonry, card-based
- **Custom Filtering** - Filter by content type, author, keywords
- **Advanced Timeline** - Algorithm controls, chronological/algorithmic toggle
- **Rich Media** - Better image/video handling, galleries
- **Interactions** - Likes, reposts, replies, quote posts
- **Profile Views** - User profiles, follower lists
- **Search & Discovery** - Search posts, users, hashtags
- **Notifications** - Real-time notifications
- **Compose UI** - Post creation with rich text
- **Threads** - Thread view and navigation

## Security Notes

⚠️ **Important Security Considerations:**

1. **App Passwords Only** - Never store your main account password
2. **LocalStorage** - Sessions are stored in localStorage (consider more secure options for production)
3. **HTTPS Required** - Always use HTTPS in production
4. **Token Rotation** - Implement proper token refresh and rotation
5. **Rate Limiting** - Be mindful of API rate limits

## Contributing

This is a personal sandbox project, but feel free to fork and experiment!

## License

MIT

## Resources

- [Bluesky](https://bsky.app)
- [AT Protocol Docs](https://atproto.com)
- [@atproto/api Documentation](https://github.com/bluesky-social/atproto/tree/main/packages/api)
- [Bluesky Developer Discord](https://discord.gg/bluesky)
