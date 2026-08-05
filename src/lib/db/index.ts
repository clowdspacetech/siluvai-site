import { isSupabaseConfigured } from "./config";
import { localRepository } from "./local-repository";
import { supabaseRepository } from "./supabase-repository";
import type { DataRepository } from "./types";

export function getRepository(): DataRepository {
  return isSupabaseConfigured() ? supabaseRepository : localRepository;
}

export { localRepository, supabaseRepository };
export type { DataRepository };
