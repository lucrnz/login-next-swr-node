import Head from 'next/head'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export default () => {
  return (
    <>
      <main className={[inter.className].join(' ')}>
        <h1>Login example</h1>
        <Navigation />
      </main>
    </>
  )
}
