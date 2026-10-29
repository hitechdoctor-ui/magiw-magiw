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

### Admin login online (`/admin`)

`.env.local` on your laptop is **not** uploaded to GitHub. On the host (e.g. Vercel → **Settings → Environment Variables**):

1. Add `ADMIN_PASSWORD` with your admin password (plain text, no quotes).
2. Scope **Production** (and Preview if you use preview URLs).
3. **Redeploy** after saving env vars.

Local dev uses `.env.local`; production uses only what you set on the host. See `.env.example`.

**Railway:** open service **magiw-magiw** → **Variables** (environment **production**) → add:

| Variable | Purpose |
|----------|---------|
| `ADMIN_PASSWORD` | Login at `/admin` |
| `OPENAI_API_KEY` | AI Product Copilot (`sk-...` from [OpenAI API keys](https://platform.openai.com/api-keys)) |

Save, then redeploy if Railway does not auto-redeploy.

**Product photos online:** uploads go to **Supabase Storage** (bucket `product-images`) when Supabase env vars are set. Without them, Railway only keeps files on ephemeral disk — URLs like `/images/products/...` break after redeploy (broken image icons in admin). Run Supabase migration `010_product_images_storage.sql`, set the Supabase variables on Railway, redeploy, then **re-upload** photos for each product.
