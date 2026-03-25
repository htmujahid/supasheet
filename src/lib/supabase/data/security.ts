import { mutationOptions, queryOptions } from "@tanstack/react-query"

import { supabase } from "#/lib/supabase/client"

export const mfaFactorsQueryOptions = queryOptions({
  queryKey: ["auth", "mfa-factors"],
  queryFn: async () => {
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (error) throw error
    return data
  },
  staleTime: 1000 * 60 * 5,
})

export const updatePasswordMutationOptions = mutationOptions({
  mutationFn: async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  },
})

export const enrollTotpMutationOptions = mutationOptions({
  mutationFn: async () => {
    const { data: existing } = await supabase.auth.mfa.listFactors()
    const unverified =
      existing?.totp.filter((f) => f.status !== "verified") ?? []
    await Promise.all(
      unverified.map((f) => supabase.auth.mfa.unenroll({ factorId: f.id }))
    )

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    })
    if (error) throw error
    return data
  },
})

export const verifyTotpMutationOptions = mutationOptions({
  mutationFn: async ({
    factorId,
    code,
  }: {
    factorId: string
    code: string
  }) => {
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    })
    if (error) throw error
    return data
  },
})

export const unenrollMfaMutationOptions = mutationOptions({
  mutationFn: async (factorId: string) => {
    const { data, error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) throw error
    return data
  },
})
