/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import styles from "@/styles/login.module.css";
import commonStyles from "@/styles/common.module.css";
import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { UserWithPassword } from "@/types/Entities";
import MainLayout from "@/components/MainLayout/MainLayout";
import { loginAction } from "@/utils/actions";
import { useRouter } from "next/router";
import { captchaSiteKey, defaultPageLoggedIn, enableCaptcha } from "@/config";
import useUser from "@/hooks/User/useUser";
import Card from "@/components/Card/Card";
import useFormValidation from "@/hooks/useFormValidation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";

const Field = {
  Email: "Email",
  Password: "Password"
};

const validations = {
  [Field.Email]: {
    validate: (value: string) => value.includes("@") && value.trim() !== "",
    id: "email",
    message: "Email is invalid"
  },
  [Field.Password]: {
    validate: (value: string) => value.trim() !== "",
    id: "password",
    message: "Password is empty"
  }
};

export default function LoginPage() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { loggedOut, loading: loadingUser } = useUser();
  const [captchaToken, setCaptchaToken] = useState("");
  const providedMessage = router.query?.message || "";
  const defaultEmail = (router.query?.email as string) || "";
  const [message, setMessage] = useState(
    providedMessage
      ? Array.isArray(providedMessage)
        ? providedMessage.join(" ")
        : providedMessage
      : ""
  );

  const {
    validateField,
    validateAllInputs,
    getValidationErrorsForField,
    getInputValues
  } = useFormValidation(validations, formRef);

  useEffect(() => {
    if (!loggedOut && !loadingUser && isRedirecting) {
      router.replace(defaultPageLoggedIn);
    }
  }, [loggedOut, loadingUser, isRedirecting, router]);

  async function formSubmitEventHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);

    if (!formRef || !formRef.current) {
      return;
    }

    const errors = validateAllInputs();

    if (errors.length) {
      return;
    }

    if (enableCaptcha && captchaToken.length === 0) {
      return setMessage((_) => "Invalid captcha, please try again.");
    }

    const values = getInputValues();
    const userData = {
      email: values[Field.Email],
      password: values[Field.Password]
    } as Partial<UserWithPassword>;

    const loginResult = await loginAction(userData, captchaToken);

    if (loginResult.success) {
      setIsRedirecting((_) => true);
    } else {
      setLoginError(loginResult.data.message);
    }
  }

  async function captchaOnVerify(token: string, _: string) {
    setCaptchaToken((_) => token);
  }

  return (
    <MainLayout
      title="Login"
      classList={[styles["main-layout"]]}
      disableRedirect
    >
      <Card classList={[styles["main-card"]]}>
        <div className={styles["main-container"]}>
          {message.length > 0 && (
            <span className={commonStyles["header-message"]}>{message}</span>
          )}
          <span className={styles["title"]}>Welcome - Login</span>
          {isRedirecting ? (
            <p>You are being redirected, please wait...</p>
          ) : (
            <form
              className={styles["form"]}
              onSubmit={formSubmitEventHandler}
              ref={formRef}
            >
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={commonStyles["text-field"]}
                  onBlur={() => validateField(Field.Email)}
                  defaultValue={defaultEmail}
                />
                {getValidationErrorsForField(Field.Email).map(
                  (message, index) => (
                    <span key={index} className={commonStyles["text-error"]}>
                      {message}
                    </span>
                  )
                )}
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className={commonStyles["text-field"]}
                  onBlur={() => validateField(Field.Password)}
                />
                {getValidationErrorsForField(Field.Password).map(
                  (message, index) => (
                    <span key={index} className={commonStyles["text-error"]}>
                      {message}
                    </span>
                  )
                )}
              </div>
              {loginError !== null && (
                <span className={commonStyles["text-error"]}>{loginError}</span>
              )}
              <div>
                <div className={styles["account-notice"]}>
                  <span>Don't have an account?</span>
                  <Link href="/signup" className={commonStyles["link"]}>
                    Create an account here.
                  </Link>
                </div>
                {enableCaptcha && (
                  <HCaptcha
                    sitekey={captchaSiteKey}
                    onVerify={captchaOnVerify}
                  />
                )}
                <input
                  type="submit"
                  value="Login"
                  className={[
                    commonStyles["button"],
                    commonStyles["blue-button"]
                  ].join(" ")}
                />
              </div>
            </form>
          )}
        </div>
      </Card>
    </MainLayout>
  );
}
