import Head from "next/head";
import Header from "./header";

function Layout({ user, loading = false, children }) {
  return (
    <div className="container mx-auto max-w-xl">
      <Head>
        <title>Next.js with Auth0</title>
      </Head>

      <Header user={user} loading={loading} />

      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}

export default Layout;
