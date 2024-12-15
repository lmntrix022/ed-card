'use server';
import clientPromise from "../../../libs/mongoClient"; // Chemin adapté à votre projet
import { getServerSession } from "next-auth"; // Utilisez getServerSession pour la nouvelle API d'authentification
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { name, company, role, status, email, website, phone } = body;

    // Validation des champs requis
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Le nom et l'email sont obligatoires." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db();
    const contactCollection = db.collection("contact");

    const newContact = {
      name,
      company: company || null,
      role: role || null,
      status: status || "Customer", // Valeur par défaut
      email,
      website: website || null,
      phone: phone || null,
      user: session.user, // Lien avec l'utilisateur connecté
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await contactCollection.insertOne(newContact);

    if (result.acknowledged) {
      return new Response(
        JSON.stringify({ success: true, data: newContact }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Erreur lors de l'ajout du contact." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
