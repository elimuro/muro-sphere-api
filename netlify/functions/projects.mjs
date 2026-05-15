const COLLECTION_ID = "672592acc621bd945f9f6fa3";
const WEBFLOW_API = "https://api.webflow.com/v2";

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const token = process.env.WEBFLOW_API_TOKEN;
  if (!token) {
    return Response.json({ error: "WEBFLOW_API_TOKEN not configured" }, { status: 500 });
  }

  const url = `${WEBFLOW_API}/collections/${COLLECTION_ID}/items?limit=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "accept-version": "2.0.0",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    return Response.json(
      { error: "Webflow API error", status: res.status, detail: body },
      { status: 502 }
    );
  }

  const data = await res.json();

  const projects = (data.items ?? [])
    .filter((item) => !item.isDraft && !item.isArchived)
    .map((item) => {
      const fields = item.fieldData;
      const imageGrid = fields["image-grid"];
      const firstImage =
        Array.isArray(imageGrid) && imageGrid.length > 0
          ? imageGrid[0].url
          : null;

      return {
        name: fields.name,
        slug: fields.slug,
        image: firstImage,
      };
    });

  return Response.json(projects);
};

export const config = {
  path: "/api/projects",
};
