export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { client, immat, marque, modele, carburant, description, km } = req.body;

  const prompt = `IMPORTANT: Réponds UNIQUEMENT avec du JSON brut valide. Zéro texte avant ou après. Zéro markdown. Zéro \`\`\`json. Juste le JSON.

Tu es un expert en mécanique automobile. Génère un devis pour un garage indépendant français.

Véhicule : ${marque} ${modele} (${carburant || 'carburant inconnu'}) — Immatriculation : ${immat} — Kilométrage : ${km}
Client : ${client}
Intervention : ${description}

Taux horaire main d'œuvre : 65 €/h. Prix HT uniquement. Sépare pièces et main d'œuvre. Maximum 10 lignes.
Pour le champ "quote_quantity_unit_of_measure_code", utilise UNIQUEMENT ces valeurs exactes : "heure" (main d'œuvre/travail), "article" (pièces/fournitures), "forfait" (prestation forfaitaire), "litre" (liquides/fluides).

{"lignes":[{"item_name":"...","detail":"...","quote_quantity":1,"quote_quantity_unit_of_measure_code":"article","item_net_price":0.00}],"remarques":"..."}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    let text = data.content[0].text.trim();
    // Strip markdown code blocks if Claude added them
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
