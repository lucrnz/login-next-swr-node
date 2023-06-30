import styles from "@/styles/login.module.css";
import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { UserWithPassword } from "@/types/User";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { loginAction } from "@/utils/loginAction";
import { useRouter } from "next/router";
import { defaultPageLoggedIn } from "@/config";
import { useUser } from "@/hooks/User/useUser";
import { Card } from "@/components/Card/Card";
import { useFormValidation } from "@/hooks/useFormValidation";

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

  const providedMessage = router.query?.message || "";

  const message = providedMessage
    ? Array.isArray(providedMessage)
      ? providedMessage.join(" ")
      : providedMessage
    : "";

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
  }, [loggedOut, loadingUser]);

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

    const values = getInputValues();
    const userData = {
      email: values[Field.Email],
      password: values[Field.Password]
    } as Partial<UserWithPassword>;

    const loginResult = await loginAction(userData);

    if (loginResult.success) {
      setIsRedirecting((_) => true);
    } else {
      setLoginError(loginResult.data.message);
    }
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
            <span className={styles["header-message"]}>{message}</span>
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
                  className={styles["text-field"]}
                  onBlur={() => validateField(Field.Email)}
                />
                {getValidationErrorsForField(Field.Email).map(
                  (message, index) => (
                    <span key={index} className={styles["text-error"]}>
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
                  className={styles["text-field"]}
                  onBlur={() => validateField(Field.Password)}
                />
                {getValidationErrorsForField(Field.Password).map(
                  (message, index) => (
                    <span key={index} className={styles["text-error"]}>
                      {message}
                    </span>
                  )
                )}
              </div>
              {loginError !== null && (
                <span className={styles["text-error"]}>{loginError}</span>
              )}
              <input
                type="submit"
                value="Login"
                className={styles["submit-btn"]}
              />
            </form>
          )}
        </div>
      </Card>
    </MainLayout>
  );
}
