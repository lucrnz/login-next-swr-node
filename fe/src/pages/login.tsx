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

// @TODO: Move this validation logic!!

enum Field {
  Password,
  Email
}

type ValidationValue = {
  validate: (value: string) => Boolean;
  message: string;
};

const validations: {
  [field in Field]: ValidationValue;
} = {
  [Field.Email]: {
    validate: (value: string) => value.includes("@") && value.trim() !== "",
    message: "Email is invalid"
  },
  [Field.Password]: {
    validate: (value: string) => value.trim() !== "",
    message: "Password is empty"
  }
};

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [validationErrors, setValidationErrors] = useState<[Field, string][]>(
    []
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { loggedOut } = useUser();

  useEffect(() => {
    if (!loggedOut) {
      setIsRedirecting(true);
      router.replace(defaultPageLoggedIn);
    }
  }, [loggedOut]);

  function validateInputs() {
    const emailInput: HTMLInputElement =
      formRef.current!.querySelector("#email")!;
    const passwordInput: HTMLInputElement =
      formRef.current!.querySelector("#password")!;

    const errors: [Field, string][] = [];
    const values = {
      [Field.Email]: emailInput.value,
      [Field.Password]: passwordInput.value
    };

    for (const validation of Object.entries(validations)) {
      const [key, validationValue] = validation;
      const field: Field = +key;
      const newErrors = validateInput(values[field], validationValue).map(
        (error) => [field, error] as [Field, string]
      );

      for (const entry of newErrors) {
        errors.push(entry);
      }
    }

    setValidationErrors((_) => errors);
    return { errors, values };
  }

  function validateInput(value: string, validation: ValidationValue) {
    const errors: string[] = [];

    const { validate, message } = validation;

    if (!validate(value)) {
      errors.push(message);
    }

    return errors;
  }

  function validateField(field: Field, value: string) {
    const entries = Object.entries(validations);

    const entry = entries.find(
      ([validationKey, _]) => (+validationKey as Field) === field
    );

    if (!entry) {
      return;
    }

    const [_, validation] = entry;

    const newErrors = validateInput(value, validation).map(
      (error) => [field, error] as [Field, string]
    );

    setValidationErrors((errors) => {
      // Get validation errors from other inputs only
      const filtered = errors.filter(([key, _]) => (+key as Field) !== field);

      // Add validation errors from this input
      return [...filtered, ...newErrors];
    });
  }

  async function formSubmitEventHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);

    if (!formRef || !formRef.current || validationErrors.length > 0) {
      return;
    }

    const { errors, values } = validateInputs();

    if (errors.length) {
      return;
    }

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
            onBlur={(event) => {
              const value = event.target.value;
              validateField(Field.Email, value);
            }}
          />
          {validationErrors
            .filter(([field, _]) => field === Field.Email)
            .map(([_, message], index) => (
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
            onBlur={(event) => {
              const value = event.target.value;
              validateField(Field.Password, value);
            }}
          />
          {validationErrors
            .filter(([field, _]) => field === Field.Password)
            .map(([_, message], index) => (
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
