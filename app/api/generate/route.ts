// app/api/generate/route.ts
import { NextResponse } from "next/server";

/**
 * This route:
 * 1) Lists available models from Google's Generative API (v1beta).
 * 2) Picks a model that supports generateContent (prefers Gemini-like names).
 * 3) Calls the chosen model's :generateContent endpoint.
 * 4) Robustly extracts JSON from the model reply (balanced-brace extraction).
 *
 * Make sure GEMINI_API_KEY (or Google API key) is set in .env.local as GEMINI_API_KEY=...
 */

function stripCodeFences(s: string) {
  return s.replace(/```(?:json|yaml|txt)?/g, "").replace(/```/g, "").trim();
}

function findBalancedJSON(text: string): string | null {
  if (!text) return null;
  const firstPositions = ["{", "["]
    .map((c) => {
      const i = text.indexOf(c);
      return i === -1 ? Infinity : i;
    })
    .filter((n) => n !== Infinity);
  if (firstPositions.length === 0) return null;
  const startIdx = Math.min(...firstPositions);
  const openChar = text[startIdx];
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
    }
    if (inString) continue;
    if (ch === openChar) depth++;
    else if (ch === closeChar) depth--;
    if (depth === 0) {
      return text.substring(startIdx, i + 1);
    }
  }
  return null;
}

async function listModels(apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`List models failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // data.models is expected; return as array
  return data?.models ?? [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { topic, tone, platform, brandKeywords = "" } = body as Record<string, string>;

    if (!topic || !tone || !platform) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "Gemini API key missing", fallback: true }, { status: 200 });
    }

    // 1) Fetch available models and pick one that supports generateContent.
    let chosenModelName: string | null = null;
    try {
      const models = await listModels(API_KEY);
      // Prefer Gemini models first
      const prefer = models.find((m: any) =>
        typeof m.name === "string" && /gemini|gemini-/.test(m.name.toLowerCase())
      );
      if (prefer) chosenModelName = prefer.name;
      // else find any model that likely supports generateContent (text-bison etc.)
      if (!chosenModelName) {
        const fallbackModel = models.find((m: any) =>
          typeof m.name === "string" && /text-bison|chat-bison|text-bison-/.test(m.name.toLowerCase())
        );
        if (fallbackModel) chosenModelName = fallbackModel.name;
      }
      // as a last resort, try 'models/text-bison-001' (commonly available)
      if (!chosenModelName) chosenModelName = "models/text-bison-001";
    } catch (err) {
      // don't fail hard — fallback to a common name, will be handled by response
      chosenModelName = "models/text-bison-001";
    }

    // Build the prompt (strict JSON instruction)
    const prompt = `
Respond ONLY in JSON. NO explanation. Output keys:
- main_post (string)
- variants (array of 3 strings)
- hashtags (array of 10 strings)
- imagePrompt (string)

Context:
topic = ${topic}
tone = ${tone}
platform = ${platform}
brandKeywords = ${brandKeywords}
`;

    // 2) Call the chosen model's generateContent endpoint
    // Model name usually looks like: models/gemini-2.5-pro  -> endpoint: .../v1beta/${model}:generateContent?key=API_KEY
    const encodedModel = encodeURIComponent(chosenModelName);
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${encodedModel}:generateContent?key=${API_KEY}`;

    const modelRes = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    let modelData: any;
    try {
      modelData = await modelRes.json();
    } catch (e) {
      // if the response is not JSON, read text
      const txt = await modelRes.text().catch(() => "");
      modelData = { rawText: txt };
    }

    // Extract raw text that the model produced (various shapes)
    let raw =
      modelData?.candidates?.[0]?.content?.parts?.[0]?.text ??
      modelData?.candidates?.[0]?.content?.text ??
      modelData?.candidates?.[0]?.text ??
      modelData?.text ??
      modelData?.rawText ??
      JSON.stringify(modelData);

    if (typeof raw !== "string") raw = String(raw);
    raw = stripCodeFences(raw).trim();

    // 3) Try to parse directly, then with extraction heuristics
    try {
      const direct = JSON.parse(raw);
      return NextResponse.json({ ...direct, fallback: false }, { status: 200 });
    } catch (e) {
      // proceed
    }

    const sliced = findBalancedJSON(raw);
    if (sliced) {
      try {
        const parsed = JSON.parse(sliced);
        return NextResponse.json({ ...parsed, fallback: false }, { status: 200 });
      } catch (err) {
        // continue to sanitization
      }
    }

    // Sanitization attempt (remove trailing commas, trim leading text)
    let sanit = raw.replace(/(\r\n|\n)/g, " ").replace(/,(\s*[}\]])/g, "$1").trim();
    const firstIdx = Math.min(
      ...["{", "["]
        .map((c) => {
          const i = sanit.indexOf(c);
          return i === -1 ? Infinity : i;
        })
        .filter((n) => n !== Infinity)
    );
    if (isFinite(firstIdx) && firstIdx > 0) sanit = sanit.substring(firstIdx);

    try {
      const parsed2 = JSON.parse(sanit);
      return NextResponse.json({ ...parsed2, fallback: false }, { status: 200 });
    } catch (err) {
      // final fallback — return raw data and helpful debug fields (not an error)
      return NextResponse.json(
        {
          error: "JSON_PARSE_FAIL",
          fallback: true,
          modelAttempted: chosenModelName,
          raw,
          sliced: sliced ?? null,
          sanitized: sanit,
          modelResponse: modelData,
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err), fallback: true }, { status: 200 });
  }
}
