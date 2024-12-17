import QRCode from "qrcode";

export default async function handler(req, res) {
  const { uri } = req.query;

  if (!uri) {
    return res.status(400).json({ error: "Paramètre 'uri' manquant." });
  }

  try {
    // Générer le QR Code en base64
    const qrCodeDataURL = await QRCode.toDataURL(`https://example.com/page/${uri}`);
    res.status(200).json({ qrCode: qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la génération du QR Code." });
  }
}
