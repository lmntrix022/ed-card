import clientPromise from "../../../../libs/mongoClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucun contact sélectionné pour la suppression." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("contact").deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Aucun contact trouvé à supprimer." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: `${result.deletedCount} contact(s) supprimé(s) avec succès.` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Une erreur est survenue lors de la suppression des contacts." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
