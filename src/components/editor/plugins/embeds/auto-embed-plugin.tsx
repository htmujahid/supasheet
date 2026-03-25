import type { JSX } from "react"

import type { EmbedConfig } from "@lexical/react/LexicalAutoEmbedPlugin"

export type CustomEmbedConfig = EmbedConfig & {
  contentName: string
  icon?: JSX.Element
  keywords: string[]
}

export const EmbedConfigs: CustomEmbedConfig[] = []
