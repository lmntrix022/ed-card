// src/app/api/vcard/route.js

export async function GET(req) {
  try {
    // Récupérer les paramètres de la requête GET
    const { searchParams } = new URL(req.url);
    const displayName = searchParams.get('displayName');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const address = searchParams.get('address');
    
    // Récupérer les paramètres multiples
    const websites = searchParams.getAll('website');  // Récupère tous les sites web
    const facebook = searchParams.getAll('facebook');  // Récupère tous les profils Facebook
    const twitter = searchParams.getAll('twitter');  // Récupère tous les profils Twitter
    const linkedin = searchParams.getAll('linkedin');  // Récupère tous les profils LinkedIn
    const instagram = searchParams.getAll('instagram');  // Récupère tous les profils Instagram

    // Vérification si displayName et email sont présents
    if (!displayName || !email) {
      return new Response('displayName and email are required', { status: 400 });
    }

    // Création de la vCard avec les informations reçues
    let vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${displayName}
EMAIL:${email || 'Not provided'}
`;

    // Ajouter le téléphone si disponible
    if (phone) {
      vCardData += `TEL:${phone}\n`;
    } else {
      vCardData += `TEL:Not provided\n`; // Si le téléphone n'est pas fourni, ajouter "Not provided"
    }

    // Ajouter l'adresse si disponible
    if (address) {
      vCardData += `ADR:${address}\n`;
    } else {
      vCardData += `ADR:Not provided\n`; // Si l'adresse n'est pas fournie, ajouter "Not provided"
    }

    // Ajouter les informations du site web (si plusieurs, les ajouter toutes)
    websites.forEach((website) => {
      vCardData += `URL:${website}\n`;
    });

    // Ajouter les liens vers les réseaux sociaux (si plusieurs, les ajouter toutes)
    facebook.forEach((fb) => {
      vCardData += `X-SOCIALPROFILE;type=facebook:${fb}\n`;
    });
    twitter.forEach((tw) => {
      vCardData += `X-SOCIALPROFILE;type=twitter:${tw}\n`;
    });
    linkedin.forEach((ln) => {
      vCardData += `X-SOCIALPROFILE;type=linkedin:${ln}\n`;
    });
    instagram.forEach((insta) => {
      vCardData += `X-SOCIALPROFILE;type=instagram:${insta}\n`;
    });

    // Clôturer la vCard
    vCardData += `END:VCARD`;

    // Créer une réponse avec les en-têtes appropriés pour le téléchargement du fichier vCard
    return new Response(vCardData, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename=${displayName}.vcf`,
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);  // Log de l'erreur
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
