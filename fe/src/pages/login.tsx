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
  const { loggedOut } = useUser();

  const {
    validateField,
    validateAllInputs,
    getValidationErrorsForField,
    getInputValues
  } = useFormValidation(validations, formRef);

  useEffect(() => {
    if (!loggedOut) {
      setIsRedirecting(true);
      router.replace(defaultPageLoggedIn);
    }
  }, [loggedOut]);

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

    if (!loginResult.success) {
      setLoginError(loginResult.data.message);
    }
  }

  let formContents = <p>You are being redirected, please wait...</p>;

  if (!isRedirecting) {
    formContents = (
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
          {getValidationErrorsForField(Field.Email).map((message, index) => (
            <p key={index} className={styles["text-error"]}>
              {message}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={styles["text-field"]}
            onBlur={() => validateField(Field.Password)}
          />
          {getValidationErrorsForField(Field.Password).map((message, index) => (
            <p key={index} className={styles["text-error"]}>
              {message}
            </p>
          ))}
        </div>
        {loginError !== null && (
          <p className={styles["text-error"]}>{loginError}</p>
        )}
        <input type="submit" value="Login" />
      </form>
    );
  }

  return (
    <MainLayout title="Login">
      <Card>
        <span className={styles["title"]}>Welcome - Login</span>
        {formContents}
      </Card>
    </MainLayout>
  );
}
