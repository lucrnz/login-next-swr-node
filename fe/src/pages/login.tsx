import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from './login.module.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] })

export default () => {
  return (
    <>
      <Head>
        <title>Login - App</title>
      </Head>
      <main className={[styles['main'], inter.className].join(' ')} >
        <span className={styles['title']}>Welcome - Login</span>
        <form className={styles['form']}>
          <div>
            <label htmlFor='email'>Email</label>
            <input id="email" type="email" className={styles['text-field']} />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input id="password" type="password" className={styles['text-field']} />
          </div>
          <input type="submit" value="Login" />
        </form>
        <Navigation />
      </main >
    </>
  )
}
