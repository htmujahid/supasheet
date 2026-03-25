import { mutationOptions, queryOptions } from "@tanstack/react-query"

import { supabase } from "#/lib/supabase/client"

export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["supasheet", "user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .from("users")
        .select("id, name, email, picture_url")
        .eq("id", userId)
        .single()
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })

export const updateAccountNameMutationOptions = (userId: string) =>
  mutationOptions({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .schema("supasheet")
        .from("users")
        .update({ name })
        .eq("id", userId)
      if (error) throw error
    },
  })

export const removeAccountAvatarMutationOptions = (userId: string) =>
  mutationOptions({
    mutationFn: async (pictureUrl: string) => {
      const marker = "/object/public/account_image/"
      const idx = pictureUrl.indexOf(marker)
      if (idx !== -1) {
        const path = pictureUrl.slice(idx + marker.length)
        await supabase.storage.from("account_image").remove([path])
      }

      const { error } = await supabase
        .schema("supasheet")
        .from("users")
        .update({ picture_url: null })
        .eq("id", userId)
      if (error) throw error
    },
  })

export const uploadAccountAvatarMutationOptions = (userId: string) =>
  mutationOptions({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop()
      const path = `${userId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("account_image")
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("account_image").getPublicUrl(path)

      const { error: updateError } = await supabase
        .schema("supasheet")
        .from("users")
        .update({ picture_url: publicUrl })
        .eq("id", userId)
      if (updateError) throw updateError
    },
  })
