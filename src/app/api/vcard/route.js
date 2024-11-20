export async function GET(req) {
  try {
    // Récupérer les paramètres de la requête GET
    const { searchParams } = new URL(req.url);
    const displayName = searchParams.get('displayName');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const address = searchParams.get('address');
    const photoUrl = searchParams.get('photo'); // Nouvelle clé pour la photo

    // Récupérer les paramètres multiples
    const websites = searchParams.getAll('website');
    const facebook = searchParams.getAll('facebook');
    const twitter = searchParams.getAll('twitter');
    const linkedin = searchParams.getAll('linkedin');
    const instagram = searchParams.getAll('instagram');

    // Vérification des champs obligatoires
    if (!displayName || !email) {
      return new Response('displayName and email are required', { status: 400 });
    }

    // Télécharger et encoder la photo en base64
    let photoData = '';
    if (photoUrl) {
      try {
        const response = await fetch(photoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch photo: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = response.headers.get('content-type');
        photoData = `PHOTO;ENCODING=b;TYPE=${mimeType}:${base64}\n`;
      } catch (err) {
        console.error('Error fetching photo:', err);
      }
    }

    // Création de la vCard avec les informations reçues
    let vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${displayName}
EMAIL:${email}
${photoData}
`;

    // Ajouter les autres champs si disponibles
    vCardData += `TEL:${phone || 'Not provided'}\n`;
    vCardData += `ADR:${address || 'Not provided'}\n`;

    // Ajouter les informations multiples (websites, réseaux sociaux)
    websites.forEach((website) => {
      vCardData += `URL:${website}\n`;
    });
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

    // Retourner la réponse avec les en-têtes appropriés
    return new Response(vCardData, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename=${displayName}.vcf`,
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error); // Log de l'erreur
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
