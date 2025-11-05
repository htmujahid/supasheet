"use client";

import { useContext } from "react";

import { Turnstile, TurnstileProps } from "@marsidev/react-turnstile";

import { Captcha } from "./captcha-provider";

export function CaptchaTokenSetter({
  siteKey,
  options: optionsProp,
}: {
  siteKey: string | undefined;
  options?: TurnstileProps;
}) {
  const { setToken, setInstance } = useContext(Captcha);

  if (!siteKey) {
    return null;
  }

  const options = optionsProp ?? {
    options: {
      size: "invisible",
    },
  };

  return (
    <Turnstile
      ref={(instance) => {
        if (instance) {
          setInstance(instance);
        }
      }}
      siteKey={siteKey}
      onSuccess={setToken}
      {...options}
    />
  );
}
