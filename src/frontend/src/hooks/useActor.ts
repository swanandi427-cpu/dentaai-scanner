import { createActor } from "@/backend";
import type { backendInterface } from "@/backend.d";
import { useActor as _useActor } from "@caffeineai/core-infrastructure";

export function useActor() {
  return _useActor<backendInterface>(createActor);
}
