import { model, models, Schema } from "mongoose";

const ContactSchema = new Schema(
  {
    avatar: { type: String, default: "https://via.placeholder.com/40" }, // Avatar par défaut
    name: { type: String, required: true }, // Nom du contact
    company: { type: String, default: "N/A" }, // Entreprise associée (par défaut "N/A")
    role: { type: String, default: "N/A" }, // Poste ou rôle (par défaut "N/A")
    status: {
      type: String,
      enum: ["Client", "Fournisseur", "Partenaire"],
      default: "Client",
    }, // Statut avec options prédéfinies
    email: { type: String, required: true, unique: true }, // Email unique
    website: { type: String, default: "N/A" }, // Site Web (par défaut "N/A")
    phone: { type: String, default: "N/A" }, // Numéro de téléphone
    message: { type: String, default: "" }, // Message optionnel
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Référence vers l'utilisateur
  },
  { timestamps: true }
);

export const Contact = models?.Contact || model("Contact", ContactSchema);
