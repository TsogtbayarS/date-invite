# Sushi Date Invite 🍣

A small, mobile-first React + TypeScript invitation site.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Publish to GitHub

Create a GitHub repository, then run:

```bash
git init
git add .
git commit -m "Initial date invite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then in the repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Push to `main`.
4. The included `.github/workflows/deploy.yml` workflow builds and deploys the site.

The Vite build uses relative asset URLs so the project can be hosted under a GitHub Pages repository path.

## Current version

- Low-pressure intro and context screens
- Yes / Maybe / No branches
- Playful loading screen after Yes
- Coffee / Dinner / Something Fun / Surprise selection
- Dinner cuisine selection
- Sushi Easter egg
- “You choose” / “Let the sushi guy choose” branch
- Responsive mobile-first styling
- GitHub Pages workflow

## Next milestone

Add:

- Real 24073 / nearby restaurant data
- Something-fun venue choices
- Dessert/preference questions
- Explicit **Send my answer** screen
- External backend/email notification

GitHub Pages only serves the frontend. Receiving a submitted answer will require an external backend/serverless service such as Supabase, Formspree, or a serverless API.
