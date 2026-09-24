# Portfolio Malcolm Boukaka

Site vitrine (Next.js) pour vendre des outils sur mesure aux PME.

## Admin
- Aller sur `/admin`, saisir le mot de passe : la roue crantée apparaît en bas à droite.
- Ajouter, modifier, réordonner, supprimer des projets. Images et PDF uploadés sur Vercel Blob.
- 5 essais ratés en 15 minutes bloquent temporairement la connexion depuis la même adresse IP.
- La page publique est statique : elle se régénère automatiquement après chaque enregistrement.

## Variables d'environnement (Vercel > Settings > Environment Variables)
- `ADMIN_PASSWORD` : mot de passe admin, long et unique (20 caractères ou plus)
- `SESSION_SECRET` : chaîne aléatoire d'au moins 32 caractères (`openssl rand -hex 32`).
  La changer déconnecte toutes les sessions admin (utile en cas de doute).
- `BLOB_READ_WRITE_TOKEN` : ajouté automatiquement par le Blob store
- `RESEND_API_KEY` : clé Resend « envoi uniquement », pour le formulaire de contact.
  Sans domaine vérifié, les messages partent de onboarding@resend.dev vers l'adresse du compte Resend.
- `CONTACT_FROM` (facultatif) : expéditeur une fois un domaine vérifié sur Resend
- `NEXT_PUBLIC_SITE_URL` : URL publique du site, sans slash final (sert au SEO et aux aperçus de partage)

Sur Vercel, le « Root Directory » du projet doit être `portefollio`.

## Contenu à compléter (`lib/config.ts`)
- `LEGAL` : statut, SIRET et adresse, affichés dans `/mentions-legales`
- `LINKEDIN_URL`, `BOOKING_URL` (Calendly, Cal.com…) : les liens apparaissent dès qu'ils sont remplis

## Local
```
npm install
cp .env.example .env.local   # remplir les valeurs
npm run dev
```
Sans `BLOB_READ_WRITE_TOKEN`, le site affiche les projets de `lib/seed.ts`.
