export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base || path.startsWith("http") || path.startsWith(base)) {
    return path;
  }
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
