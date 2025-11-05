import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function TermsAndConditionsFormField(
  props: {
    name?: string;
  } = {},
) {
  return (
    <FormField
      name={props.name ?? "termsAccepted"}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <label className={"flex items-start space-x-2 py-2"}>
                <Checkbox required name={field.name} />

                <div className={"text-xs"}>
                  I accept the{" "}
                  <Link
                    target={"_blank"}
                    className={"underline"}
                    href={"/terms-of-service"}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    target={"_blank"}
                    className={"underline"}
                    href={"/privacy-policy"}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </label>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
