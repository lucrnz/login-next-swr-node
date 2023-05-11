import Head from 'next/head';
import { Inter } from 'next/font/google';
import Link from 'next/link';

import styles from './login.module.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] })

export default () => {
  return (
    <>
      <Head>
        <title>Login - App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={[styles['main'], inter.className].join(' ')} >
        <h1>Login example</h1>
        <form className={styles['form']}>
          <div>
            <label htmlFor='username'>Username</label>
            <input id="username" type="text" />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input id="password" type="password" />
          </div>
        </form>
        <Navigation />
      </main >
    </>
  )
}