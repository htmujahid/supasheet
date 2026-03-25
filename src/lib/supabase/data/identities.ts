import type { Provider, UserIdentity } from "@supabase/supabase-js"

import { mutationOptions, queryOptions } from "@tanstack/react-query"

import { supabase } from "#/lib/supabase/client"

export const identitiesQueryOptions = queryOptions({
  queryKey: ["auth", "identities"],
  queryFn: async () => {
    const { data, error } = await supabase.auth.getUserIdentities()
    if (error) throw error
    return data.identities
  },
  staleTime: 1000 * 60 * 5,
})

export const updateEmailMutationOptions = mutationOptions({
  mutationFn: async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) throw error
  },
})

export const linkIdentityMutationOptions = mutationOptions({
  mutationFn: async (provider: Provider) => {
    const { error } = await supabase.auth.linkIdentity({ provider })
    if (error) throw error
  },
})

export const unlinkIdentityMutationOptions = mutationOptions({
  mutationFn: async (identity: UserIdentity) => {
    const { error } = await supabase.auth.unlinkIdentity(identity)
    if (error) throw error
  },
})
