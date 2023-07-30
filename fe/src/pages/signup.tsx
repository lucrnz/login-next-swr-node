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
import { signUpAction } from "@/utils/actions";
import { useRouter } from "next/router";
import { captchaSiteKey, defaultPageLoggedIn, enableCaptcha } from "@/config";
import useUser from "@/hooks/User/useUser";
import Card from "@/components/Card/Card";
import useFormValidation from "@/hooks/useFormValidation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { fetchApi } from "@/utils/api";

const Field = {
  Name: "Name",
  Email: "Email",
  Password: "Password",
  ConfirmPassword: "ConfirmPassword"
};

const validations = {
  [Field.Name]: {
    validate: (value: string) => value.trim() !== "",
    id: "name",
    message: "Name is empty"
  },
  [Field.Email]: {
    validate: (value: string) => value.includes("@") && value.trim() !== "",
    id: "email",
    message: "Email is invalid"
  },
  [Field.Password]: {
    validate: (value: string) => value.length >= 10,
    id: "password",
    message: "Password should have at least 10 characters"
  },
  [Field.ConfirmPassword]: {
    validate: (value: string) => value.trim() !== "",
    id: "confirm-password",
    message: "Password is empty"
  }
};

export default function signUpPage() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [message, setMessage] = useState("");

  const {
    validateField,
    validateAllInputs,
    getValidationErrorsForField,
    getInputValues
  } = useFormValidation(validations, formRef);

  async function formSubmitEventHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(() => "");

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

    if (values[Field.Password] !== values[Field.ConfirmPassword]) {
      return setMessage((_) => "Password confirmation doesn't match Password");
    }

    const userData = {
      name: values[Field.Name],
      email: values[Field.Email],
      password: values[Field.Password]
    } as Omit<UserWithPassword, "id">;

    const apiResult = await signUpAction(userData, captchaToken);

    if (apiResult.success) {
      router.push({
        pathname: "/login",
        query: {
          message: "Account created! You may now login.",
          email: userData.email
        }
      });
    } else {
      setMessage(apiResult.data.message);
    }
  }

  async function captchaOnVerify(token: string, _: string) {
    setCaptchaToken((_) => token);
  }

  return (
    <MainLayout
      title="Create an account"
      classList={[styles["main-layout"]]}
      disableRedirect
    >
      <Card classList={[styles["main-card"]]}>
        <div className={styles["main-container"]}>
          {message.length > 0 && (
            <span className={commonStyles["header-message"]}>{message}</span>
          )}
          <span className={styles["title"]}>Create an account</span>

          <form
            className={styles["form"]}
            onSubmit={formSubmitEventHandler}
            ref={formRef}
          >
            <div>
              <label htmlFor="email">Name</label>
              <input
                id="name"
                type="text"
                className={commonStyles["text-field"]}
                onBlur={() => validateField(Field.Name)}
              />
              {getValidationErrorsForField(Field.Name).map((message, index) => (
                <span key={index} className={commonStyles["text-error"]}>
                  {message}
                </span>
              ))}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={commonStyles["text-field"]}
                onBlur={() => validateField(Field.Email)}
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

            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className={commonStyles["text-field"]}
                onBlur={() => validateField(Field.ConfirmPassword)}
              />
              {getValidationErrorsForField(Field.ConfirmPassword).map(
                (message, index) => (
                  <span key={index} className={commonStyles["text-error"]}>
                    {message}
                  </span>
                )
              )}
            </div>
            <div>
              {enableCaptcha && (
                <HCaptcha sitekey={captchaSiteKey} onVerify={captchaOnVerify} />
              )}
              <input
                type="submit"
                value="Sign Up"
                className={[
                  commonStyles["button"],
                  commonStyles["blue-button"]
                ].join(" ")}
              />
            </div>
          </form>
        </div>
      </Card>
    </MainLayout>
  );
}
