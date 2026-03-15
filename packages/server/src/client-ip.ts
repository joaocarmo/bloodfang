/**
 * Extract the client IP from request headers, checking common proxy headers.
 * Falls back to 'unknown' if no IP can be determined.
 */
export function getClientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  return (
    c.req.header('cf-connecting-ip') ??
    parseForwardedFor(c.req.header('x-forwarded-for')) ??
    'unknown'
  );
}

function parseForwardedFor(header: string | undefined): string | undefined {
  if (!header) return undefined;
  return header.split(',')[0]?.trim() ?? undefined;
}
