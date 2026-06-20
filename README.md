# Garage D'Aumetz — Automatisation devis

Formulaire web → Claude API → Tiime API. Devis généré en 60 secondes.

## Stack
- **Frontend** : HTML/CSS/JS pur (Vercel)
- **Orchestration** : Make.com
- **LLM** : Claude API (Sonnet)
- **Devis** : Tiime API

## Setup

1. Déployer `index.html` sur Vercel
2. Créer le scénario Make.com (webhook → Claude → Tiime)
3. Remplacer `VOTRE_WEBHOOK_MAKE_ICI` dans `index.html` par l'URL Make

## Fichiers

- `index.html` — formulaire de saisie + affichage résultat
- `prompt.md` — prompt système Claude à copier dans Make
