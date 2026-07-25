/* eslint-disable @typescript-eslint/no-explicit-any */

// Flatten a Tina rich-text AST into plain text for meta descriptions.
export function richTextToPlainText(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(richTextToPlainText).join(" ");
  }
  return "";
}

// Search engines truncate descriptions around 160 characters, so cap slightly
// under that and only add the ellipsis when something was actually cut.
const MAX_LENGTH = 155;

export function excerptFromRichText(node: any, fallback: string): string {
  const text = richTextToPlainText(node).replace(/\s+/g, " ").trim();

  if (!text) return fallback;
  if (text.length <= MAX_LENGTH) return text;

  return `${text.slice(0, MAX_LENGTH).trimEnd()}…`;
}
