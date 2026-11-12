import { llmsText } from "@/lib/facts";

export const dynamic = "force-static";

/** A plain markdown brief for language models: what Stack is, what it does and where to read more. */
export function GET() {
  return new Response(llmsText(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
