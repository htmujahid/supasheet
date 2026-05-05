import { useState } from "react"

import { SendHorizontalIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { Textarea } from "#/components/ui/textarea"

export function ChatInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (question: string) => void
  disabled: boolean
}) {
  const [value, setValue] = useState("")

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue("")
  }

  return (
    <div className="border-t bg-background">
      <div className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Ask anything about your data… (⌘/Ctrl + Enter to send)"
          rows={2}
          className="resize-none"
          disabled={disabled}
        />
        <Button
          onClick={submit}
          disabled={disabled || value.trim().length === 0}
          size="icon"
          aria-label="Send"
        >
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  )
}
