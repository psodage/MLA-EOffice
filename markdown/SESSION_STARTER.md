# MLA E-Office — Session Starter Guide

> **Read this at the start of every coding session.**
>
> This guide tells you how to work with the AI effectively to build the MLA E-Office system — what files to open, how to give context, what to say, and common patterns that work well.

---

## Before Every Session — 5-Minute Checklist

```
☐ 1. Open MODULE_TRACKER.md — know where you are
☐ 2. Open BUILD_ORDER.md — find the current module's prompt
☐ 3. Open DEV_COMMANDS.md — keep handy for running commands
☐ 4. Make sure your dev servers are running (npm run dev for both api/ and web/)
☐ 5. Copy the "Prompt to Start" from BUILD_ORDER.md and paste it first
```

---

## How to Start a New Session (New Chat)

**The AI doesn't remember previous conversations. Always start with context.**

Use this template at the very start of every new chat:

```
I'm building MLA E-Office — a management system for an MLA's (Member of Legislative Assembly) 
office in Maharashtra, India.

Tech stack:
- Backend: Node.js + Express (folder: api/)
- Frontend: React 18 + Vite (folder: web/)
- Database: MySQL 8 + Sequelize ORM
- Auth: JWT (access + refresh tokens, Zustand store on frontend)
- File uploads: Cloudinary
- Deployment: Vercel (web) + Render (api) + Railway (MySQL)

Current status: [PASTE YOUR CURRENT STATUS HERE — e.g., "Auth is done, now building Inward module"]

Today's goal: [WHAT YOU WANT TO BUILD TODAY]

[PASTE THE PROMPT FROM BUILD_ORDER.md]
```

---

## How to Continue a Session (Same Chat)

If you're continuing in the same chat, just be direct:

```
Good. Now let's do [next feature].
```

```
That worked. Now add [next thing].
```

```
I got this error: [PASTE ERROR]. Help me fix it.
```

---

## Sharing Reference Files

When the AI asks for more context or when starting a complex module, paste the relevant section from the reference files.

**How to share a file section:**
1. Open the reference file (e.g., `DATA_MODELS.md`)
2. Find the relevant table/section
3. Copy and paste it into the chat with a label:

```
Here's the schema from DATA_MODELS.md for the nivedans table:

[PASTE THE TABLE ROWS HERE]
```

**Which file for which module:**

| Module | Primary Files to Reference |
|--------|---------------------------|
| Auth | `AUTH_SPEC.md`, `USER_ROLES.md` |
| Inward/Outward | `DATA_MODELS.md` Tables 2-3, `BUSINESS_RULES.md` |
| Nivedan | `DATA_MODELS.md` Tables 4-5, `BUSINESS_RULES.md` Section 2, `AUTO_ROUTING_RULES.md` |
| Visitor | `DATA_MODELS.md` Table 6 |
| DevWorks | `DATA_MODELS.md` Tables 7-8 |
| Karyakarta | `KARYAKARTA_SEED_DATA.md`, `DATA_MODELS.md` Table 9 |
| WhatsApp | `WHATSAPP_TEMPLATES.md`, `ENV_CONFIG.md` |
| Geography dropdowns | `GEOGRAPHY_RURAL.md`, `GEOGRAPHY_URBAN.md` |
| Reports | `DATA_MODELS.md` (all tables) |
| Error messages | `ERROR_MESSAGES.md` |
| AI letter drafting | `AI_LETTER_DRAFTING.md`, `LETTER_TEMPLATES/LETTER_TEMPLATES.md` |

---

## Golden Rules for Working with AI

### ✅ DO

**Be specific about what you want:**
```
Good:  "Build the POST /api/v1/nivedans endpoint. It should auto-generate NIV-YYYY-NNNNN tracking ID 
       and auto-suggest department from category.default_department_id"

Bad:   "Build the nivedan API"
```

**Tell the AI what's already done:**
```
Good: "Auth middleware is done. The controller can use req.user.id and req.user.role."

Bad: (say nothing and let AI assume)
```

**Paste errors completely:**
```
Good: Paste the FULL error stack trace

Bad: "I got a Sequelize error"
```

**Ask the AI to explain tricky parts:**
```
"Explain what this middleware does before we move on"

"Why did you use transaction here? When is that needed?"
```

**Build one thing at a time:**
```
Good: "Let's do the backend API first, test it with Postman, then do the UI"

Bad: "Build the entire Nivedan module in one go"
```

---

### ❌ DON'T

- **Don't paste entire huge files** — paste only the relevant section
- **Don't skip testing** — test each API in Postman/Thunder Client before building UI
- **Don't ignore errors** — fix every error before moving to the next feature
- **Don't build all features at once** — one feature per session works best
- **Don't forget to update MODULE_TRACKER.md** — mark items ✅ as you complete them

---

## When You Get Stuck

### Error in terminal?
```
1. Copy the FULL error message
2. Paste into chat: "I got this error when running [command]: [PASTE ERROR]"
3. Tell the AI: "Here's the relevant file: [paste the file content]"
```

### UI doesn't look right?
```
"The [component] doesn't look right. I want it to [describe what you want].
 Here's the current code: [paste component]"
```

### AI's solution doesn't work?
```
"That didn't work. Here's what happened: [describe]
 Error: [paste error if any]
 Can you try a different approach?"
```

### Not sure what to build next?
```
Open MODULE_TRACKER.md → find first ☐ item → go to BUILD_ORDER.md → copy its prompt
```

---

## Useful Things to Ask the AI

| Situation | What to Ask |
|-----------|------------|
| After building a feature | "Write a quick test using curl to verify this endpoint works" |
| Before complex logic | "Explain the approach before writing any code" |
| When code gets messy | "Refactor this controller to be cleaner, same functionality" |
| For Marathi UI text | "What should this button/label say in Marathi?" |
| For validation | "Add proper validation to this form / endpoint using Joi" |
| For performance | "Is there a better way to write this DB query?" |
| For security | "Is this safe? Are there any security issues?" |

---

## Session End Routine

At the end of each session:

```
1. ✅ Update MODULE_TRACKER.md — mark completed items
2. 💾 Git commit your work: git commit -am "Add [module] [feature]"
3. 📝 Note any blockers or next steps at the top of MODULE_TRACKER.md
4. 🛑 Stop dev servers (Ctrl+C in both terminals)
```

---

## Useful Reminders

### The AI Reference Files (for the AI — not for you to read fully)
These files are in `s:\MLA E - Office\` and contain the full specs. You only need to paste **relevant sections** into the chat when needed.

### Your 4 Working Files (keep these open)
- `BUILD_ORDER.md` — what to build
- `MODULE_TRACKER.md` — progress tracker ← **update this constantly**
- `SESSION_STARTER.md` — this file
- `DEV_COMMANDS.md` — commands to run

### Language
- **UI labels** → Marathi (मराठी) is primary, English is secondary
- **Code** → English (variable names, comments, API routes)
- **Database** → English (column names, table names)
- **Error messages** → Bilingual (see `ERROR_MESSAGES.md`)

---
