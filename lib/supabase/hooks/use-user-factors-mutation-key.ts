/**
 * @name useFactorsMutationKey
 * @description This hook returns the mutation key for the useUserFactorsMutation hook
 * Useful to reuse in both query and mutation hooks
 * @param userId
 */
export function useFactorsMutationKey(userId: string) {
  return ['mfa-factors', userId];
}
