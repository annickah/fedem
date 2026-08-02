# Production FEDEM : Vercel + Neon Postgres + Vercel Blob

## Pourquoi Postgres et pas KV

Postgres est la source de vérité du CMS : articles structurés, comptes, rôles, brouillons, recherche et détection de conflits. Un KV/Redis est utile pour le cache et le rate limiting, mais n'est pas nécessaire au lancement et ne remplace pas correctement la base métier.

Vercel Postgres et Vercel KV ne sont plus des produits créés directement. Les équivalents actuels sont disponibles dans Vercel Marketplace : Neon Postgres et Upstash Redis.

## 1. Ajouter Neon depuis Vercel

1. Ouvrez le projet dans Vercel.
2. Allez dans **Storage / Marketplace**.
3. Installez **Neon Postgres**.
4. Connectez l'intégration au projet FEDEM.
5. Vercel injecte automatiquement `DATABASE_URL`.
6. Le schéma est créé automatiquement au premier appel API. Une copie se trouve aussi dans `sql/schema.sql`.

## 2. Ajouter Vercel Blob

1. Dans Vercel Storage, créez un Blob store public.
2. Connectez-le au projet.
3. Vercel injecte `BLOB_READ_WRITE_TOKEN`.
4. Les images sont compressées dans le navigateur puis envoyées directement à Blob grâce à un jeton temporaire généré par `/api/blob/upload`.

Le token Blob ne doit jamais être préfixé par `VITE_` ou exposé dans React.

## 3. Configurer l'authentification initiale

Générez un hash bcrypt du mot de passe administrateur :

```bash
node scripts/hash-password.mjs "VOTRE_NOUVEAU_MOT_DE_PASSE_FORT"
```

Ajoutez ensuite dans **Vercel > Settings > Environment Variables** :

```text
AUTH_SECRET=<secret-aléatoire-d'au-moins-32-caractères>
ADMIN_EMAIL=contact@fedem.mg
ADMIN_PASSWORD_HASH=<résultat-bcrypt>
ADMIN_PIN_HASH=<hash bcrypt du PIN, facultatif>
```

Le mot de passe n'est jamais placé dans le frontend. Lors de la première connexion, si la table `cms_users` est vide, le serveur crée le premier compte `admin` en vérifiant ce hash.

Pour autoriser aussi un code PIN de 4 à 8 chiffres :

```bash
node scripts/hash-password.mjs "123456" --pin
```

Ajoutez le résultat dans `ADMIN_PIN_HASH`. Utilisez idéalement un PIN de 6 à 8 chiffres.

Après la première connexion réussie, vous pouvez retirer `ADMIN_PASSWORD_HASH` de Vercel et redéployer. Le hash conservé en base continue de fonctionner.

## 4. Ajouter d'autres administrateurs

Générez d'abord un hash bcrypt, puis exécutez cette requête dans l'éditeur SQL Neon :

```sql
INSERT INTO cms_users (id, email, password_hash, pin_hash, role, active)
VALUES (
  gen_random_uuid()::text,
  'editeur@fedem.mg',
  '<HASH_BCRYPT>',
  '<HASH_PIN_OU_NULL>',
  'editor',
  TRUE
);
```

Rôles :

- `admin` : créer, modifier, publier, supprimer et restaurer ;
- `editor` : créer, modifier et publier, sans suppression.

Pour désactiver un compte :

```sql
UPDATE cms_users SET active = FALSE WHERE email = 'editeur@fedem.mg';
```

## 5. Développement local

Les routes `/api` sont des fonctions Vercel. Utilisez :

```bash
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```

`npm run dev` seul lance Vite mais pas les fonctions API ; la connexion admin échouera donc en local si vous n'utilisez pas `vercel dev`.

## 6. Sécurité appliquée

- Identifiants vérifiés uniquement dans les fonctions serveur.
- Hash bcrypt coût 12.
- Session JWT signée dans un cookie `HttpOnly`, `SameSite=Strict` et `Secure` en production.
- Secret JWT uniquement dans Vercel.
- Vérification du compte actif et du rôle pour chaque écriture.
- Requêtes d'écriture limitées au même domaine.
- 10 tentatives de connexion maximum par IP sur 15 minutes.
- Validation serveur de tous les champs.
- Brouillons absents des réponses publiques.
- Détection de conflit par version d'article.
- Téléversements Blob autorisés uniquement après authentification.
- Images limitées à 5 Mo dans la route d'upload.
- Suppression des anciennes images Blob lors du remplacement ou de la suppression d'un article.

## 7. Variables Vercel

```text
DATABASE_URL=<injecté par Neon>
BLOB_READ_WRITE_TOKEN=<injecté par Vercel Blob>
AUTH_SECRET=<secret serveur>
ADMIN_EMAIL=contact@fedem.mg
ADMIN_PASSWORD_HASH=<hash bcrypt temporaire pour le premier compte>
ADMIN_PIN_HASH=<hash bcrypt du PIN, facultatif>
RESEND_API_KEY=<clé Resend facultative>
REPLY_FROM_EMAIL=FEDEM Madagascar <contact@fedem.mg>
```

Aucune de ces variables ne doit avoir le préfixe `VITE_`.

## 8. Recommandations

1. Le mot de passe précédemment partagé doit être remplacé avant production.
2. Activez l'authentification à deux facteurs sur Vercel et Neon.
3. Utilisez un compte différent pour chaque membre de l'équipe.
4. Créez des sauvegardes Neon et surveillez les métriques Vercel Blob.
5. Ajoutez éventuellement Upstash Redis plus tard pour un rate limiting distribué à très fort trafic ; le rate limiter Postgres actuel suffit pour ce CMS.

## 9. Back-office disponible

- Authentification par mot de passe ou PIN avec verrouillage après plusieurs erreurs.
- Tableau de bord : membres, adhésions, articles publiés et messages en attente.
- CRUD complet des articles et images.
- Traitement des messages et adhésions avec statuts Nouveau, En cours et Traité.
- Réponse par lien e-mail ou envoi automatique si Resend est configuré.
- Modification des partenaires, du nombre de membres et des statistiques publiques.
- Export complet JSON ou CSV pour archivage.