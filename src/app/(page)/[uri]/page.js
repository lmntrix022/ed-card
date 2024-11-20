import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
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

  // Connecter à la base de données
  await mongoose.connect(process.env.MONGO_URI);

  // Charger les données de la page et de l'utilisateur
  const page = await Page.findOne({ uri });
  const user = await User.findOne({ email: page.owner });

  // Enregistrer l'événement de vue
  await Event.create({ uri: uri, page: uri, type: "view" });

  // Préparer les paramètres pour l'API vCard
  const vcardParams = new URLSearchParams({
    displayName: page.displayName,
    email: page.buttons.email || "",
    phone: page.buttons.mobile || "",
    address: page.location || "",
    photo: user.image, // Ajouter la photo de profil
  });

  // Ajouter les liens et les réseaux sociaux (s'ils existent)
  if (page.links) {
    page.links.forEach((link) => vcardParams.append("website", link.url));
  }
  if (page.buttons.instagram) {
    vcardParams.append("instagram", page.buttons.instagram);
  }
  if (page.buttons.facebook) {
    vcardParams.append("facebook", page.buttons.facebook);
  }
  if (page.buttons.linkedin) {
    vcardParams.append("linkedin", page.buttons.linkedin);
  }
  if (page.buttons.twitter) {
    vcardParams.append("twitter", page.buttons.twitter);
  }

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: page.bgColor }}>
      {/* Bannière */}
      <div
        className="h-36 w-full bg-cover bg-center"
        style={
          page.bgType === "color"
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }
      ></div>

      {/* Avatar */}
      <div className="relative -top-16 w-36 h-36 rounded-full shadow-lg overflow-hidden border-4 border-white ">
        <Image
          className="object-cover w-full h-full"
          src={user.image}
          alt="avatar"
          width={256}
          height={256}
        />
      </div>

      {/* Nom et localisation */}
      <h2 className="-mt-6 text-3xl font-semibold text-white px-4 mb-4">{page.displayName}</h2>
      <h3 className="text-lg text-white/70 flex items-center gap-2">
        <FontAwesomeIcon icon={faLocationDot} className="h-5" />
        <span>{page.location}</span>
      </h3>

      {/* Biographie */}
      <p className="text-center text-white/80 max-w-lg mt-4 px-4 text-justify">{page.bio}</p>

      {/* Boutons */}
      <div className="flex gap-4 justify-center mt-6 pb-4 flex-wrap ">
        {Object.keys(page.buttons).map((buttonKey) => (
          <Link
            key={buttonKey}
            href={buttonLink(buttonKey, page.buttons[buttonKey])}
            className="rounded-full bg-white text-blue-950 p-3 flex items-center justify-center shadow-md shadow-neumorphism hover:shadow-neumorphism-hover active:shadow-neumorphism-active transition"
          >
            <FontAwesomeIcon className="w-6 h-6" icon={buttonsIcons[buttonKey]} />
          </Link>
        ))}
      </div>

      {/* Télécharger Contact */}
      <div className="mt-6">
        <Link
          href={`/api/vcard?${vcardParams.toString()}`}
          className="px-6 py-3 rounded-full shadow-neumorphism hover:shadow-neumorphism-hover active:shadow-neumorphism-active transition"
        >
          Sauvegarder contact
        </Link>
      </div>


      {/* Liens */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full max-w-4xl">
        {page.links.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            target="_blank"
            className="flex items-center gap-4 text-white p-4 rounded-lg shadow-lg shadow-neumorphism hover:shadow-neumorphism-hover active:shadow-neumorphism-active transition"
          >
            <div className="w-12 h-12 bg-blue-700/60 flex items-center justify-center rounded-full">
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
            <div>
              <h3 className="font-semibold">{link.title}</h3>
              <p className="text-sm text-white/70">{link.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}