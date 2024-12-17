import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import QRCode from "qrcode"; // Import de la bibliothèque QRCode

import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faLinkedin,
  faTiktok,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export const buttonsIcons = {
  email: faEnvelope,
  mobile: faPhone,
  instagram: faInstagram,
  facebook: faFacebook,
  discord: faDiscord,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  github: faGithub,
  telegram: faTelegram,
  linkedin: faLinkedin,
};

function buttonLink(key, value) {
  if (key === "mobile") {
    return "tel:" + value;
  }
  if (key === "email") {
    return "mailto:" + value;
  }
  return value;
}

export default async function UserPage({ params }) {
  const uri = params.uri;
  const pageUrl = `${process.env.BASE_URL}/${uri}`; // URL complète

  // Connecter à la base de données
  await mongoose.connect(process.env.MONGO_URI);

  // Charger les données de la page et de l'utilisateur
  const page = await Page.findOne({ uri });
  const user = await User.findOne({ email: page.owner });

  // Enregistrer l'événement de vue
  await Event.create({ uri: uri, page: uri, type: "view" });

  // Générer le QR Code en base64 avec l'URL complète
  const qrCodeBase64 = await QRCode.toDataURL(pageUrl);

  return (
    <div className="min-h-screen flex flex-col items-center font-sans" style={{ backgroundColor: page.bgColor }}>
      {/* Bannière */}
      <div
        className="h-80 w-full bg-cover bg-center shadow-md rounded-b-[38%]"
        style={
          page.bgType === "color"
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }
      ></div>

      {/* Avatar */}
      <div className="relative -top-20 w-36 h-36 rounded-full shadow-lg overflow-hidden border-4 border-white ">
        <Image
          className="object-cover w-full h-full shadow-md"
          src={user.image}
          alt="avatar"
          width={256}
          height={256}
        />
      </div>

      {/* Nom et localisation */}
      <h2 className="-mt-6 text-3xl font-semibold text-black px-4 mb-4 ">{page.displayName}</h2>
      <h3 className="text-lg text-black/70 flex items-center gap-2">
        <FontAwesomeIcon icon={faLocationDot} className="h-5" />
        <span>{page.location}</span>
      </h3>

      {/* Biographie */}
      <p className="text-center text-black/80 max-w-lg mt-4 px-4 text-justify">{page.bio}</p>

      {/* Boutons */}
      <div className="flex gap-4 justify-center mt-6 pb-4 flex-wrap ">
        {Object.keys(page.buttons).map((buttonKey) => (
          <Link
            key={buttonKey}
            href={buttonLink(buttonKey, page.buttons[buttonKey])}
            className="rounded-full bg-white text-blue-950 p-3 flex items-center justify-center shadow-md hover:bg-blue-950 hover:text-white transition"
          >
            <FontAwesomeIcon className="w-8 h-8" icon={buttonsIcons[buttonKey]} />
          </Link>
        ))}
      </div>

      {/* Télécharger Contact */}
      <div className="mt-6 flex gap-4">
        <Link
          href={`/api/vcard?${new URLSearchParams({
            displayName: page.displayName,
            email: page.buttons.email || "",
            phone: page.buttons.mobile || "",
            address: page.location || "",
            photo: user.image,
          }).toString()}`}
          className="px-6 py-3 rounded-full bg-blue-950 text-white shadow-lg hover:bg-[#fff] hover:text-blue-950 transition"
        >
          Sauvegarder contact
        </Link>

        
      </div>

      {/* QR Code */}
      <div className="mt-6 ">
        <img src={qrCodeBase64} alt="QR Code" className="rounded-lg mx-auto shadow-lg border border-gray-200 " />
        <p className="text-gray-500 mt-6">Scannez ce QR Code pour visiter la page.</p>
      </div>

      {/* Liens */}
      <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {page.links.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            target="_blank"
            className="flex items-center gap-4 text-black p-4 rounded-lg shadow-lg hover:bg-blue-950 hover:text-white transition"
          >
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full">
              {link.icon ? (
                <Image
                  src={link.icon}
                  alt="icon"
                  className="object-cover w-full h-full rounded-full shadow-md"
                  width={48}
                  height={48}
                />
              ) : (
                <FontAwesomeIcon icon={faLink} className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="">
              <h3 className="font-semibold ">{link.title}</h3>
              <p className="text-sm text-white/70">{link.subtitle}</p>
            </div>
          </Link>
        ))}

        
      </div>

      <Footer />
    </div>
  );
}
