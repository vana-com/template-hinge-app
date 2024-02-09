## Dating Copilot

This app generates prompts + responses to common "Hinge" questions, using your [Vana Gotchi](https://www.vana.com/) as a guide. It can also serve as a starting point for other Gotchi-based apps.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Environment Variables

There are four environment variables that need to be set in order to run the app (found in `.env.sample`):

```bash
NEXT_PUBLIC_CLIENT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # Vana OAuth client ID
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Base URL for the app
NEXT_PUBLIC_VANA_API_URL="https://development-api.vana.com" # Vana API URL
NEXT_PUBLIC_VANA_OAUTH_URL="https://development-oauth.vana.com" # Vana OAuth URL
```

`NEXT_PUBLIC_CLIENT_ID` is the OAuth client ID for the Vana API. Contact Vana developers to get a unique ID for your app. The other three variables are the base URL, API URL, and OAuth URL for the Vana API. These are set to the development URLs by default, but should be updated to the production URLs when deploying the app.

Once environment variables are loaded, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.