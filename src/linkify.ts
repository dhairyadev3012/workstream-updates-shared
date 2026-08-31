const URL_PATTERN = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}"'`]+$/;

export interface TextSegment {
  type: "text" | "link";
  value: string;
  href?: string;
}

/** Splits free text into plain-text and link segments, so a UI layer can
 * render pasted URLs as clickable links without touching the rest of the
 * text. Trims common trailing punctuation off a matched URL (a period or
 * closing paren at the end of a sentence should not be part of the link). */
export function splitTextWithLinks(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    let raw = match[0];
    let end = start + raw.length;

    const trailing = raw.match(TRAILING_PUNCTUATION);
    if (trailing) {
      raw = raw.slice(0, raw.length - trailing[0].length);
      end -= trailing[0].length;
    }
    if (raw.length === 0) continue;

    if (start > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, start) });
    }
    segments.push({
      type: "link",
      value: raw,
      href: raw.toLowerCase().startsWith("www.") ? `https://${raw}` : raw,
    });
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
