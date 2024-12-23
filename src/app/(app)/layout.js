import { Poppins } from 'next/font/google';
import '../globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Eqcard',
  description: 'Créez des connexions authentiques qui laissent une impression durable. Révolutionnez votre manière de réseauter avec des cartes de visite digitales personnalisées et impactantes.',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en" className="font-sans">
      <body>{children}</body>
    </html>
  )
}
