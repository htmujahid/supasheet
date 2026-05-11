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

const ALLOWED_AVATAR_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
])
const AVATAR_MAX_BYTES = 2 * 1024 * 1024 // 2 MB
const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
}

export const uploadAccountAvatarMutationOptions = (userId: string) =>
  mutationOptions({
    mutationFn: async (file: File) => {
      if (!ALLOWED_AVATAR_MIME.has(file.type)) {
        throw new Error("Avatar must be a PNG, JPEG, or WebP image")
      }
      if (file.size > AVATAR_MAX_BYTES) {
        throw new Error("Avatar must be 2 MB or smaller")
      }
      const ext = MIME_TO_EXT[file.type]
      const path = `${userId}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("account_image")
        .upload(path, file, { upsert: true, contentType: file.type })
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
