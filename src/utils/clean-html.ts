export function cleanHtml(html: string, maxLength: number = 60) {
  if (!html) return "";

  let plainText = "";

  // 1. Browser/Client-side: Use the native DOM parser (Bulletproof)
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      plainText = doc.body.textContent || "";
    } catch (e) {
      // Fallback to regex if parsing fails for some reason
      plainText = regexClean(html);
    }
  }
  // 2. Server-side (Node.js/SSR): Use robust regex
  else {
    plainText = regexClean(html);
  }

  // Final Cleanup: Collapse multiple spaces/newlines into one single space
  const cleaned = plainText.replace(/\s+/g, " ").trim();

  if (cleaned.length <= maxLength) return cleaned;

  // Truncate and add ellipsis, ensuring no space before the dots
  return cleaned.substring(0, maxLength).trim() + "...";
}

/**
 * Robust Regex fallback for environments without DOM access (SSR)
 */
function regexClean(html: string): string {
  return (
    html
      // Remove script, style, and title tags AND their contents
      .replace(/<(script|style|title)[^>]*>[\s\S]*?<\/\1>/gi, "")
      // Replace block-level tags with a space to prevent "HelloWorld" squashing
      .replace(
        /<(br|p|div|h[1-6]|li|tr|section|article|header|footer)[^>]*\/?>/gi,
        " ",
      )
      // Remove all remaining HTML tags
      .replace(/<[^>]*>/g, "")
      // Decode common HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&apos;/g, "'")
      // Handle numeric entities (e.g., &#123;)
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
  );
}
