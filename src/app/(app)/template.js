import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import AppSidebar from "@/components/layout/AppSidebar";
import {Page} from "@/models/Page";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {Lato} from 'next/font/google'
import '../globals.css'
import {headers} from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {redirect} from "next/navigation";
import {Toaster} from "react-hot-toast";

const lato = Lato({ subsets: ['latin'], weight: ['400','700'] })

export const metadata = {
  title: 'Eqcard',
  description: 'Créez des connexions authentiques qui laissent une impression durable. Révolutionnez votre manière de réseauter avec des cartes de visite digitales personnalisées et impactantes.',
}

export default async function AppTemplate({ children, ...rest }) {
  const headersList = headers();
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/');
  }
  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session.user.email});
  return (
    <html lang="en">
      <body className={lato.className}>
        <Toaster />
        <main className="md:flex min-h-screen font-sans">
          {/* Hamburger Icon at the bottom-right of the page */}
          <label htmlFor="navCb" className="md:hidden p-4 rounded-md bg-white/30 backdrop-blur-lg shadow inline-flex items-center gap-2 cursor-pointer fixed top-10 right-8 z-30">
            <FontAwesomeIcon icon={faBars} className="text-black" />
          </label>
          <input id="navCb" type="checkbox" className="hidden" />
          <label htmlFor="navCb" className="hidden backdrop fixed inset-0 bg-black/80 z-10"></label>

          <aside className="bg-white w-48 p-4 pt-6 shadow fixed md:static -left-48 top-0 bottom-0 z-20 transition-all">
            <div className="sticky top-0 pt-2">
              <div className="rounded-full overflow-hidden aspect-square w-24 mx-auto">
                <Image src={session.user.image} width={256} height={256} alt={'avatar'} />
              </div>
              {page && (
                <Link
                  target="_blank"
                  href={'/'+page.uri}
                  className="text-center mt-4 flex gap-1 items-center justify-center">
                  <Image src="/eq-card.png" alt="Eqcard" width={50} height={50} />
                  <span className="text-xl text-gray-300">/</span>
                  <span>{page.uri}</span>
                </Link>
              )}
              <div className="text-center">
                <AppSidebar />
              </div>
            </div>
          </aside>
          <div className="grow">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
