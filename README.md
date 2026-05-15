# muro-sphere-api

Netlify serverless function that proxies the Webflow CMS API to serve project data for the Muro Studio globe visualization.

## Endpoint

`GET /api/projects`

Returns a JSON array of published projects with `name`, `slug`, and `image` (first image-grid URL) for each item.

## Setup

1. Deploy to Netlify (connect this repo).
2. Add the environment variable `WEBFLOW_API_TOKEN` in the Netlify dashboard under **Site configuration > Environment variables**.
3. The function is available at `https://<your-site>.netlify.app/api/projects`.

## Local development

```bash
npm i -g netlify-cli
netlify dev
```

Then visit `http://localhost:8888/api/projects`.
