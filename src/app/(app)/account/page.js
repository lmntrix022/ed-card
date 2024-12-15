import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { Page } from "@/models/Page";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloneDeep from "clone-deep";

export default async function AccountPage({ searchParams }) {
  // Obtenir la session utilisateur
  const session = await getServerSession(authOptions);
  const desiredUsername = searchParams?.desiredUsername || "";

  // Rediriger si l'utilisateur n'est pas authentifié
  if (!session) {
    return redirect("/");
  }

  // Connexion à MongoDB
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    return (
      <div>
        <p>Erreur interne : Impossible de se connecter à la base de données.</p>
      </div>
    );
  }

  // Rechercher la page liée à l'utilisateur
  let page;
  try {
    page = await Page.findOne({ owner: session.user.email });
  } catch (error) {
    console.error("Erreur lors de la recherche de la page :", error);
    return (
      <div>
        <p>Erreur interne : Impossible de charger les informations de l'utilisateur.</p>
      </div>
    );
  }

  // Si aucune page n'est trouvée, afficher le formulaire de création d'utilisateur
  if (!page) {
    return (
      <div>
        <UsernameForm desiredUsername={desiredUsername} />
      </div>
    );
  }

  // Convertir les données MongoDB pour éviter les problèmes avec Next.js
  let leanPage;
  try {
    leanPage = cloneDeep(page.toJSON());
    leanPage._id = leanPage._id.toString();
  } catch (error) {
    console.error("Erreur lors de la transformation des données de la page :", error);
    return (
      <div>
        <p>Erreur interne : Problème lors du traitement des données de la page.</p>
      </div>
    );
  }

  // Afficher les formulaires pour gérer la page
  return (
    <>
      <PageSettingsForm page={leanPage} user={session.user} />
      <PageButtonsForm page={leanPage} user={session.user} />
      <PageLinksForm page={leanPage} user={session.user} />
    </>
  );
}
