import Link from "next/link";

import { Trans } from "@/components/makerkit/trans";
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
                  <Trans
                    i18nKey={"auth:acceptTermsAndConditions"}
                    components={{
                      TermsOfServiceLink: (
                        <Link
                          target={"_blank"}
                          className={"underline"}
                          href={"/terms-of-service"}
                        >
                          <Trans i18nKey={"auth:termsOfService"} />
                        </Link>
                      ),
                      PrivacyPolicyLink: (
                        <Link
                          target={"_blank"}
                          className={"underline"}
                          href={"/privacy-policy"}
                        >
                          <Trans i18nKey={"auth:privacyPolicy"} />
                        </Link>
                      ),
                    }}
                  />
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
