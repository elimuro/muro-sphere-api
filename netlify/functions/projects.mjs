const COLLECTION_ID = "672592acc621bd945f9f6fa3";
const WEBFLOW_API = "https://api.webflow.com/v2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  const token = process.env.WEBFLOW_API_TOKEN;
  if (!token) {
    return Response.json(
      { error: "WEBFLOW_API_TOKEN not configured" },
      { status: 500, headers: cors }
    );
  }

  const url = `${WEBFLOW_API}/collections/${COLLECTION_ID}/items?limit=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "accept-version": "2.0.0",
    },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Webflow API error", status: res.status },
      { status: 502, headers: cors }
    );
  }

  const data = await res.json();

  const projects = (data.items ?? [])
    .filter((item) => !item.isDraft && !item.isArchived)
    .map((item) => {
      const fields = item.fieldData;
      const imageGrid = fields["image-grid"];

      return {
        name: fields.name,
        slug: fields.slug,
        images: (imageGrid || []).map((i) => i.url).filter(Boolean),
      };
    });

  return Response.json(projects, { headers: cors });
};

export const config = {
  path: "/api/projects",
};
