# 24-games
24-games-calculator

## Local development

```bash
npm run dev
```

Open `http://localhost:5173/`.

## GitHub Pages

This is a static site. Publish from the repository root with GitHub Pages:

1. Go to repository `Settings` -> `Pages`.
2. Set source to deploy from the main branch root.
3. Set the custom domain to `cftang.dev`.
4. Enable `Enforce HTTPS` after GitHub finishes issuing the certificate.

DNS records for `cftang.dev`:

```text
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
```

Recommended `www` record:

```text
CNAME www  <your-github-username>.github.io
```

Replace `<your-github-username>` with the GitHub account that owns the Pages site.
