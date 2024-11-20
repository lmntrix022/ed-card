// components/Footer.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";  // Pour gérer l'affichage des images

const footerIcons = {
  facebook: faFacebook,
  instagram: faInstagram,
  linkedin: faLinkedin,
  twitter: faTwitter,
  email: faEnvelope,
};

const Footer = () => {
  return (
    <footer className=" text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        
        
        {/* Copyright et lien vers la politique de confidentialité */}
        <div className="flex justify-center items-center gap-2 text-sm mt-4 text-black">
        <Link
                href="/create"  // Remplacez par le lien vers la page de création de l'Eqcard
                className="bg-white text-blue-950 py-2 px-6 rounded-full hover:bg-blue-950 hover:text-white transition"
            >
                <Image
                    src="/eq-card.png"  // Assurez-vous que ce chemin est correct
                    alt="Eqcard Logo"
                    width={40}  // Ajustez la taille du logo
                    height={40}
                />
            <p className="text-lg font-semibold">Créez votre propre Eqcard</p>
            </Link>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
