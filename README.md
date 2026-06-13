# IdeaVault - Startup Idea Sharing Platform

IdeaVault is a startup idea sharing platform where users can publish ideas, explore community submissions, and collaborate through comments and discussions.

## Live Site

Live Site URL: https://idea-vault-client-lilac.vercel.app/

## Key Features

- Browse trending startup ideas on the home page with a featured banner and idea cards.
- Filter ideas by title, category, and date range from the Ideas page.
- View private idea details with a full discussion thread, comment add/edit/delete, and timestamps.
- Create and manage your own ideas with update and delete flows.
- Track your activity in My Interactions, including ideas you commented on.
- Sign in with email/password or Google, then return to your intended destination after auth.
- Update your profile from the account dropdown when logged in.

## Tech Stack

- Next.js 16
- React 19
- HeroUI
- Express.js
- MongoDB
- JWT authentication

## Getting Started

1. Install dependencies in the client and server folders.
2. Add the required environment variables in `.env` files.
3. Start the server, then run the client development server.

```bash
npm install
npm run dev
```

## Notes

- Error and success handling uses toast messages instead of default browser alerts.
- Route titles, loading states, and private route guards are already implemented.
- The UI is responsive for mobile, tablet, and desktop layouts.
