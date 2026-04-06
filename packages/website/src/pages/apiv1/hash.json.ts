import risks from "@public/risks.json";
import { getCollection } from "astro:content";

async function hashObject(obj: object): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET({}) {
  const psychoactives = await getCollection("psychoactives");
  const combos = await getCollection("combos");
  return new Response(
    JSON.stringify({
      risks: await hashObject(risks),
      psychoactives: await hashObject(psychoactives),
      combos: await hashObject(combos),
    })
  );
}
