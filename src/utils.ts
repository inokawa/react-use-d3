const REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export function kebabCase(str: string): string {
  return str.replace(REGEX, (match) => "-" + match.toLowerCase());
}
