# Portfolio Malcolm Boukaka

En ligne : https://mb-conseil.vercel.app (l'ancienne adresse portefollio.vercel.app y redirige).

Portfolio (Next.js) de chef de projet SI et product builder. Chaque projet a sa page : `/projets/<identifiant>`.

## Admin
- Aller sur `/admin` et saisir le mot de passe : la page liste les projets.
- Ajouter, modifier, réordonner, supprimer des projets. Images et PDF uploadés sur Vercel Blob.
- « Importer le contenu du CV » ajoute ou met à jour les projets de `lib/seed.ts` (textes remplacés, images et PDF
  conservés, autres projets inchangés).
- Une fois connecté, une roue crantée sur le site ramène à `/admin`.
- Nécessite un Blob store connecté au projet (Vercel > Storage > Create > Blob) : sans lui, la page l'indique
  et rien ne peut être enregistré.
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
- `CV_URL` : déposer le CV dans `public/` et indiquer son chemin pour afficher « Télécharger le CV »
- Objets 3D de couverture : `public/3d/` (générés avec Canva, design « Portfolio – éléments 3D (export) »),
  liste dans `lib/visuals.ts`, choix par projet dans l'admin
- Parcours, compétences et chiffres clés : `lib/profile.ts`

## Local
```
npm install
cp .env.example .env.local   # remplir les valeurs
npm run dev
```
Sans `BLOB_READ_WRITE_TOKEN`, le site affiche les projets de `lib/seed.ts`.
