'use server';

import clientPromise from "../../../../libs/mongoClient"; // Adapter le chemin si nécessaire
import { getServerSession } from "next-auth"; // Nouvelle API d'authentification
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const contactCollection = db.collection("contact");

    // Récupérer les contacts de l'utilisateur connecté
    const contacts = await contactCollection
      .find({ "user.email": session.user.email }) // Filtre basé sur l'utilisateur connecté
      .sort({ createdAt: -1 }) // Tri par date de création (décroissant)
      .toArray();

    return new Response(
      JSON.stringify({ success: true, contacts }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
