import clientPromise from "@/libs/mongoClient";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Assurez-vous que cette variable d'environnement est correctement définie
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  callbacks: {
    async session({ session, user }) {
      // Assure-toi que l'ID de l'utilisateur est inclus dans la session
      session.user.id = user._id; // Ajoute l'ID de l'utilisateur à la session
      return session;
    }
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
