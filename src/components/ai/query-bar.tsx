import { useEffect, useState } from "react"

import { CornerDownLeftIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "#/components/ui/input-group"
import { Spinner } from "#/components/ui/spinner"
import { cn } from "#/lib/utils"

const MIN_LENGTH = 10
const MAX_LENGTH = 500

export function QueryBar({
  onSubmit,
  disabled,
  pending,
  resetSignal = 0,
}: {
  onSubmit: (question: string) => void
  disabled: boolean
  pending: boolean
  resetSignal?: number
}) {
  const [value, setValue] = useState("")

  useEffect(() => {
    if (resetSignal === 0) return
    setValue("")
  }, [resetSignal])
  const trimmedLength = value.trim().length
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_LENGTH
  const tooLong = value.length > MAX_LENGTH
  const canSubmit =
    !disabled && trimmedLength >= MIN_LENGTH && value.length <= MAX_LENGTH

  function submit() {
    if (!canSubmit) return
    onSubmit(value.trim())
  }

  return (
    <InputGroup className="bg-background">
      <InputGroupTextarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        autoFocus
        placeholder="Ask a question about your data…"
        rows={2}
        disabled={disabled}
        maxLength={MAX_LENGTH}
      />
      <InputGroupAddon align="block-end">
        <InputGroupText
          className={cn((tooShort || tooLong) && "text-destructive")}
        >
          {tooShort
            ? `At least ${MIN_LENGTH} characters`
            : `${value.length}/${MAX_LENGTH}`}
        </InputGroupText>
        <InputGroupButton
          variant="default"
          size="sm"
          className="ml-auto"
          onClick={submit}
          disabled={!canSubmit}
        >
          {pending ? <Spinner /> : <CornerDownLeftIcon />}
          {pending ? "Running" : "Run"}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
