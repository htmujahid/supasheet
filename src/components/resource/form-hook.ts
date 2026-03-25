import type {
  AppFieldExtendedReactFormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from "@tanstack/react-form"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})

type ResourceFormValues = Record<string, unknown>

// Matches the type inferred by useAppForm when called without explicit validators.
// Each validator param defaults to its bound (T | undefined) rather than undefined.
type ResourceFormApi = AppFieldExtendedReactFormApi<
  ResourceFormValues,
  FormValidateOrFn<ResourceFormValues> | undefined, // TOnMount
  FormValidateOrFn<ResourceFormValues> | undefined, // TOnChange
  FormAsyncValidateOrFn<ResourceFormValues> | undefined, // TOnChangeAsync
  FormValidateOrFn<ResourceFormValues> | undefined, // TOnBlur
  FormAsyncValidateOrFn<ResourceFormValues> | undefined, // TOnBlurAsync
  FormValidateOrFn<ResourceFormValues> | undefined, // TOnSubmit
  FormAsyncValidateOrFn<ResourceFormValues> | undefined, // TOnSubmitAsync
  FormValidateOrFn<ResourceFormValues> | undefined, // TOnDynamic
  FormAsyncValidateOrFn<ResourceFormValues> | undefined, // TOnDynamicAsync
  FormAsyncValidateOrFn<ResourceFormValues> | undefined, // TOnServer
  unknown, // TSubmitMeta
  {}, // TFieldComponents (none registered)
  {} // TFormComponents (none registered)
>

export {
  fieldContext,
  formContext,
  useAppForm,
  useFieldContext,
  useFormContext,
}
export type { ResourceFormApi, ResourceFormValues }
