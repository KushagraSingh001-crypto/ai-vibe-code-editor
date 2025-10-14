🚀 AI Vibe Code Editor
VibeCode Editor is a next-generation, web-based IDE that brings the full power of modern development tools to your browser.
Built with Next.js 15, WebContainers, and an integrated AI coding assistant, it lets you write, run, and test your code instantly — no setup required.
✨ Features
🧠 AI-Powered Coding
Code Completion: Get context-aware suggestions using Ollama’s CodeLlama:7b model.
AI Chat Assistant: Ask, debug, and optimize your code through interactive chat.
💻 In-Browser Development
Monaco Editor: The same editor used in VS Code.
Interactive Terminal & Live Preview: Run Node.js apps directly inside your browser.
Multi-File Explorer: Create, rename, and manage files seamlessly.
📦 Instant Templates
Launch ready-to-code playgrounds in frameworks like Next.js, React, Vue, Angular, Express, Hono, and more.
🔐 Authentication & Cloud
NextAuth.js integration with Google and GitHub OAuth.
Personal dashboard to manage your saved projects.
⚙️ Tech Stack
Layer	Technology
Framework	Next.js 15 (App Router, Turbopack)
Language	TypeScript
Styling	Tailwind CSS + shadcn/ui
Database	MongoDB + Prisma ORM
Authentication	NextAuth.js v5
Runtime	WebContainers API
Editor	Monaco Editor
Terminal	Xterm.js
AI Engine	Ollama (CodeLlama 7B)
State Management	Zustand
🛠️ Installation & Setup
Prerequisites
Ensure you have the following installed:
Node.js ≥ 18
npm / yarn / pnpm
MongoDB (local or cloud instance)
Ollama (for AI features)
1. Clone the Repository
git clone https://github.com/kushagrasingh001/crypto-ai-vibe-code-editor.git
cd crypto-ai-vibe-code-editor
2. Install Dependencies
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add:
# MongoDB
DATABASE_URL="your_mongodb_connection_string"

# NextAuth.js
AUTH_SECRET="your_nextauth_secret"

# GitHub Auth
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"

# Google Auth
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# GitHub Token (for repo import)
GITHUB_TOKEN="your_github_personal_access_token"
4. Set Up Database
npx prisma generate
npx prisma db push
5. Configure AI Assistant (Ollama)
Make sure Ollama is installed and running locally, then pull the model:
ollama run codellama:7b
6. Run the Development Server
npm run dev
Visit 👉 http://localhost:3000
💬 Contributing
Contributions are welcome!
Fork the repo
Create a branch: git checkout -b feature/new-feature
Commit your changes: git commit -m "Added new feature"
Push to your branch: git push origin feature/new-feature
Open a Pull Request
🌐 Author
Kushagra Singh
💼 GitHub
