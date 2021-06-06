import { buildHook } from "./hooks";

const resolver = (name: string) => name;

export const useD3 = buildHook(resolver);
