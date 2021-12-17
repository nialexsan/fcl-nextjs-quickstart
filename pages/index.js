import Head from 'next/head'
import Auth from '../components/Auth'

export default function Home() {
  return (
    <div>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <div className="grid">
          <Auth />
        </div>
      </main>

    </div>
  )
}
