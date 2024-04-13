import Header from "@/components/Header";
import {Lato} from 'next/font/google'
import '../../globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'Eqcard',
  description: 'Créez des connexions authentiques qui laissent une impression durable. Révolutionnez votre manière de réseauter avec des cartes de visite digitales personnalisées et impactantes.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className={lato.className}>
    <main>
      {children}
    </main>
    </body>
    </html>
  )
}
