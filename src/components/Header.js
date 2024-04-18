
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import {getServerSession} from "next-auth";
import Link from "next/link";
import Image from "next/image";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="bg-white border-b py-4">
      <div className="max-w-4xl flex justify-between mx-auto px-6">
        <div className="flex items-center gap-6">
          <Link href={'/'} className="flex items-center gap-2 text-blue-500">
            <Image src="/eq-card.png" alt="Eqcard" width={50} height={50} />
            <span className="font-bold">Eqcard</span>
          </Link>

        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-500">
          {!!session && (
            <>
              <Link href={'/account'}>
                Bonjour, {session?.user?.name}
              </Link>
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              <Link href={'/login'}>Se connecter</Link>
              <Link href={'/login'}>Créer un compte</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}