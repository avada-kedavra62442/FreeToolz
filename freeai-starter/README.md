# FreeAI

FreeAI is an Emerald & Silver AI chat starter built for Vercel with a serverless API proxy and a genuinely free OpenRouter model. It does not claim to be GPT-6 Astra or Luna.

## Current implementation
- Responsive dark Emerald & Silver chat UI.
- Streaming model replies through a serverless /api/chat endpoint.
- Local guest conversation history, new chats, delete individual chats, clear history.
- Code-block formatting and copy buttons.
- Model API key stays server-side.
- Clear UI errors for missing credentials, provider rate limits and provider failures.
- Vercel/Vite starter configuration.

## Create the standalone repository
The GitHub connector available to this session can commit files to existing repositories but does not expose a create-repository action. This scaffold is currently committed under freeai-starter/ on the freeai-starter branch of the FreeToolz repository. To keep FreeAI independent, create a new empty repository named FreeAI under your GitHub account and copy the contents of this folder to its root. Do not deploy the FreeToolz repository itself as the FreeAI site.

## Configure a free model
1. Create an OpenRouter account and generate an API key. Check the provider's current free-tier terms and model availability first.
2. In Vercel, import the standalone FreeAI repository as a new project.
3. Add OPENROUTER_API_KEY as a server-side environment variable. Never use a VITE_ prefix for secrets.
4. Optionally set FREEAI_MODEL to a currently available model whose OpenRouter ID ends in :free. The default is google/gemma-4-31b-it:free at scaffold creation; free model IDs and availability can change.
5. Optionally set FREEAI_ALLOWED_ORIGINS to comma-separated production origins.
6. Deploy, then verify the production URL and test chat, rate limits, and error states.

## Important limitations
- No provider key is included; chat returns a clear configuration message until the environment variable is set.
- Free model providers impose changing rate limits and capacity restrictions. No unlimited availability is promised.
- Chat history is local to the current browser/device. Cloud-synced accounts are not implemented yet.
- The API includes input bounds, but the initial rate-limit protection is not a durable global quota system. Before broad public release, add persistent per-IP/session rate limiting and abuse controls using a free storage service, or keep access deliberately limited.
- The current chat UI supports text prompts and text responses. File/image input, web search, user accounts and sync, model selection, and verified citations are future features.
- Build and deployment have not been verified in this session.
