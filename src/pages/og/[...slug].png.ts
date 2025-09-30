import { getCollection } from "astro:content";
import sharp from "sharp";
import { SITE } from "@/siteConfig";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((p) => ({ params: { slug: p.id } }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const id = params.slug;
  const posts = await getCollection("blog");
  const entry = posts.find((p) => p.id === id);

  const title = (entry?.data.title ?? SITE.title).toString();
  const subtitle = (entry?.data.description ?? SITE.description).toString();

  const width = 1200;
  const height = 630;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0a0a" />
          <stop offset="100%" stop-color="#171717" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <g fill="#e5e5e5">
        <text x="60" y="300" font-size="64" font-weight="800" font-family="Cambria, Georgia, 'Times New Roman', Times, serif">
          ${escapeXml(title).slice(0, 120)}
        </text>
        <text x="60" y="360" font-size="32" font-weight="500" opacity="0.92" font-family="Cambria, Georgia, 'Times New Roman', Times, serif">
          ${escapeXml(subtitle).slice(0, 160)}
        </text>
        <text x="60" y="560" font-size="28" font-weight="600" opacity="0.9" font-family="Cambria, Georgia, 'Times New Roman', Times, serif">
          ${escapeXml(SITE.title)} • ${escapeXml(new URL(SITE.href).host)}
        </text>
      </g>
    </svg>
  `;

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
