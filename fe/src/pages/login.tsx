import Head from 'next/head';
import styles from './login.module.css';
import Navigation from '@/components/Navigation';
import { defaultFont } from '@/config';
import type { FormEvent } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

enum Field {
  Password,
  Email
}

const validations: { [field in Field]: { validate: (value: string) => Boolean, message: string } } = {
  [Field.Email]: {
    validate: (value: string) => (value.includes('@') && value.trim() !== ""),
    message: "Email is invalid"
  },
  [Field.Password]: {
    validate: (value: string) => (value.trim() !== ""),
    message: "Password is empty"
  }
};

export default () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [validationErrors, setValidationErrors] = useState<[Field, string][]>([]);

  function validateInputs() {
    const emailInput: HTMLInputElement = formRef.current!.querySelector('#email')!;
    const passwordInput: HTMLInputElement = formRef.current!.querySelector('#password')!;

    const errors: [Field, string][] = [];
    const values = {
      [Field.Email]: emailInput.value,
      [Field.Password]: passwordInput.value
    };

    for (const validation of Object.entries(validations)) {
      const [key, value] = validation;
      const { validate, message } = value;
      const field: Field = +key;

      if (!validate(values[field])) {
        errors.push([field, message]);
      }
    }

    setValidationErrors((_) => errors);
    return { errors, values };
  }

  const formSubmitEventHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef || !formRef.current || validationErrors.length > 0) {
      return;
    }

    const { errors, values } = validateInputs();

    if (errors.length) {
      return;
    }

    console.log({ email: values[Field.Email], password: values[Field.Password] });
  }

  return (
    <>
      <Head>
        <title>Login - App</title>
      </Head>
      <main className={[styles['main'], defaultFont.className].join(' ')} >
        <span className={styles['title']}>Welcome - Login</span>
        <form className={styles['form']} onSubmit={formSubmitEventHandler} ref={formRef}>
          <div>
            <label htmlFor='email'>Email</label>
            <input id="email" type="email" className={styles['text-field']} onBlur={validateInputs} />
            {validationErrors.filter(([field, _]) => field === Field.Email).map(([_, message], index) => <p key={index} className={styles['text-error']}>{message}</p>)}
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input id="password" type="password" className={styles['text-field']} onBlur={validateInputs} />
            {validationErrors.filter(([field, _]) => field === Field.Password).map(([_, message], index) => <p key={index} className={styles['text-error']}>{message}</p>)}
          </div>
          <input type="submit" value="Login" />
        </form>
        <Navigation />
      </main >
    </>
  )
}
