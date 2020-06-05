import Link from "next/link";
import Logo from "../components/svgs/Logo";

function Header({ user, loading }) {
  return (
    <header className="mb-4 py-4 sticky bg-woodsmoke-700" style={{ top: 0 }}>
      <div className="flex items-center justify-center mb-4">
        <Link href="/">
          <a>
            <Logo className="w-12 lg:w-16 mr-6 text-gray-200" />
          </a>
        </Link>
        <h1 className="text-gray-200 font-bold text-5xl lg:text-6xl uppercase">
          Hasura Fit
        </h1>
      </div>
      {user && (
        <nav className="py-4 bg-woodsmoke-800 rounded-lg py-2 px-4 justify-between flex">
          <Link href="/profile">
            <a className="border border-gray-400 rounded-full px-4 py-2 text-gray-400">
              My Account
            </a>
          </Link>
          <a
            className="border border-gray-400 rounded-full px-4 py-2 text-gray-400"
            href="/api/logout"
          >
            Logout
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;
