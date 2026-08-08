import { localRepository } from "./local-repository";
import type { DataRepository } from "./types";

/** Local JSON repository only — Supabase wiring deferred */
export function getRepository(): DataRepository {
  return localRepository;
}

export { localRepository };
export type { DataRepository };
