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
        <h1>Login example</h1>
        <form className={styles['form']}>
          <div>
            <label htmlFor='email'>Email</label>
            <input id="email" type="email" />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input id="password" type="password" />
          </div>
          <input type="submit" value="Login" />
        </form>
        <Navigation />
      </main >
    </>
  )
}
