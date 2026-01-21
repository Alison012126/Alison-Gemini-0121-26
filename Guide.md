Alison-Gemini-0121-26
# Instruction — Run this app locally

npm install


I'll relax the PowerShell execution policy for the current user, then re-run npm install.
[1]
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; npm install
[2]
npm run dev

This document guides a beginner through running the Artistic Intelligence Workspace app locally on Windows 11 and macOS (Intel/Apple Silicon).

**Overview**
- **Repo:** Contains a Vite + React TypeScript app that optionally calls Google Gemini (via `@google/genai`).
- **Dev server:** Vite serves the app on port 3000 by default.
- **API key:** Set `GEMINI_API_KEY` in `.env.local` to enable real Gemini calls. If omitted, the app uses a mock response mode.

**Prerequisites**
- **Node:** Install Node.js 18.x or 20.x (LTS recommended).
- **npm:** Included with Node. Optionally use `nvm`/`nvm-windows` to manage Node versions.
- **Network:** Internet access for dependency installation and optional API calls.

**Files of interest**
- `package.json` — scripts and dependencies.
- `vite.config.ts` — loads `GEMINI_API_KEY` and exposes it to the client build.
- `services/geminiService.ts` — how the app reads the key and falls back to a mock response.
- `index.html` — contains the `<div id="root"></div>` mount point.

**Quick setup (works on both Windows and macOS)**
1. Clone the repository and change into it:

```bash
git clone <your-repo-url> my-app
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` at the project root with your Gemini API key (optional):

```text
# .env.local
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Notes: Vite reads `.env` files automatically. The project maps `GEMINI_API_KEY` into `process.env.API_KEY` for the client code.

4. Run the dev server:

```bash
npm run dev
```

5. Open the app in a browser at:

```
http://localhost:3000
```

**Build & preview**
- Create a production build:

```bash
npm run build
```

- Preview the production build locally:

```bash
npm run preview
```

**Platform-specific notes**
- Windows 11
  - Recommended: Install Node via the official Node installer or use `nvm-windows`:

```powershell
# nvm-windows example (after installing nvm for Windows):
nvm install 20.4.0
nvm use 20.4.0
```

  - When running commands in PowerShell, prefix environment variable exports by using a `.env.local` file (preferred). Avoid `export` syntax in PowerShell.
  - If you see permission issues, run the terminal as Administrator or check antivirus blocking.

- macOS (Intel & Apple Silicon)
  - Recommended: use Homebrew + `nvm` or `fnm` for Node version management:

```bash
# Homebrew + nvm example
brew install nvm
nvm install 20
nvm use 20
```

  - No special Rosetta steps required for this app.

**How the Gemini key is used (important)**
- The app expects `GEMINI_API_KEY` in `.env.local`.
- `vite.config.ts` maps `GEMINI_API_KEY` into `process.env.API_KEY` and `process.env.GEMINI_API_KEY` so client code can reference `process.env.API_KEY`.
- `services/geminiService.ts` will use the key to create a `GoogleGenAI` client. If the key is missing, the UI will show a mock response (useful for testing without a key).

**Troubleshooting**
- `Port 3000 already in use`:
  - Stop the process using that port or run Vite on another port:

```bash
npx vite --port 3001
# or set in package.json: "dev": "vite --port 3001"
```

- `Missing root element` error on startup:
  - Ensure `index.html` contains `<div id="root"></div>` (this project already does).

- `Module not found` or dependency errors:
  - Run `npm install` again and check Node version matches recommended LTS.
  - Delete `node_modules` and `package-lock.json` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

(Windows PowerShell users: use `rd /s /q node_modules` and `del package-lock.json`)

- `TypeScript`/`Vite` compile errors:
  - Read the error stack, most issues are missing environment variables or mismatched package versions. Try updating Node or installing matching versions.

- API errors from Gemini:
  - Ensure the key is valid and has the required permissions.
  - Check network connectivity and any corporate proxy settings.
  - If errors persist, the app will surface the error text returned from the API in the UI.

**Security & API key handling**
- Do NOT commit `.env.local` to Git. Add it to `.gitignore` (the repo likely already ignores env files).
- For production deployments, keep the key on the server or a secure environment system (CI/CD secrets, hosting environment variables).

**Developer tips**
- Use `npm run dev` and open the browser developer console to inspect network/API logs.
- The UI gracefully falls back to a mock response if no API key is provided — useful for experimenting without incurring API usage.

**Where to look in the code**
- `services/geminiService.ts` — shows how the app initializes `GoogleGenAI` and handles no-key mock responses.
- `vite.config.ts` — shows how `GEMINI_API_KEY` is injected into the client bundle.
- `App.tsx` and `components/*` — main UI and where features live.

**Quick checklist for a beginner**
- [ ] Install Node (18.x/20.x recommended)
- [ ] Clone repo and run `npm install`
- [ ] Add `.env.local` with `GEMINI_API_KEY` (optional)
- [ ] Run `npm run dev` and open `http://localhost:3000`

---
If you'd like, I can also add a `.env.example` file to the repo, or create a short troubleshooting script for Windows and macOS. Which would you prefer next?
