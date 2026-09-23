# Portfolio Malcolm Boukaka

Site vitrine (Next.js) pour vendre des outils sur mesure aux PME.

## Admin
- Aller sur `/admin`, saisir le mot de passe : la roue crantée apparaît en bas à droite.
- Ajouter, modifier, réordonner, supprimer des projets. Images et PDF uploadés sur Vercel Blob.

## Variables d'environnement (Vercel > Settings > Environment Variables)
- `ADMIN_PASSWORD` : mot de passe admin
- `SESSION_SECRET` : chaîne aléatoire (signe le cookie de session)
- `BLOB_READ_WRITE_TOKEN` : ajouté automatiquement par le Blob store

## Local
```
npm install
cp .env.example .env.local   # remplir les valeurs
npm run dev
```
Sans `BLOB_READ_WRITE_TOKEN`, le site affiche les projets de `lib/seed.ts`.
