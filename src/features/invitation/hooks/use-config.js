import { useInvitation } from "@/features/invitation/invitation-context";

export function useConfig() {
  const { config } = useInvitation();

  // No more fallback! Just return the real database config.
  return config; 
}