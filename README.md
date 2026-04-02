This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker Setup

Run the app locally with Docker:

```bash
# Copy environment variables template
cp .env.example .env

# Edit .env and fill in your GitHub OAuth credentials
# For local testing, you can skip GitHub credentials initially

# Start the app on http://localhost:6969
docker compose up --build
```

### Environment Variables Required

- `AUTH_SECRET` - Session secret (generate with: `openssl rand -base64 32`)
- `GITHUB_CLIENT_ID` - From GitHub OAuth app
- `GITHUB_CLIENT_SECRET` - From GitHub OAuth app

### Public Access with Cloudflare Tunnel

To expose your resume publicly via Cloudflare:

1. Install `cloudflared`: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
2. Create a tunnel: `cloudflared tunnel create resume`
3. Get your tunnel token and add to `.env`: `CLOUDFLARE_TUNNEL_TOKEN=your_token`
4. Start with tunnel: `docker compose up --build`

The app will be publicly accessible via your Cloudflare tunnel URL.
