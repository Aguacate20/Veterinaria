// AdSense exige /ads.txt con tu ID de editor. Se genera a partir de NEXT_PUBLIC_ADSENSE_CLIENT.
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ca-pub-XXXXXXXXXXXXXXXX
  const pub = client?.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
