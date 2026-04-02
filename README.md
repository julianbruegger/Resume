# Resume

A simple containerized resume served with nginx and exposed via Cloudflare tunnel.

## Local Development

```bash
docker compose up --build
```

Resume will be available at `http://localhost:6969`

## Public Access (Cloudflare Tunnel)

1. Create a Cloudflare tunnel:
   ```bash
   cloudflared tunnel create resume
   ```

2. Get your tunnel token and add to `.env`:
   ```bash
   cp .env.example .env
   # Edit .env and paste your CLOUDFLARE_TUNNEL_TOKEN
   ```

3. Start with tunnel:
   ```bash
   docker compose up --build
   ```

4. Your resume will be publicly accessible via the Cloudflare tunnel URL.
