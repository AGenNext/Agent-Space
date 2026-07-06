import { nanoid } from "nanoid";

export function createId(prefix: string): string {
  return `${prefix}:${nanoid(16).toLowerCase()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
