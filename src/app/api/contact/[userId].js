import { connectToDatabase } from "../../../utils/mongodb";
import { Contact } from "../../../models/Contact";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      const contacts = await Contact.find({ user: userId }).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée." });
  }
}
