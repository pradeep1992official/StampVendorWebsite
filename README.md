# StampVendorWebsite

A web application for stamp vendor services and rental agreement drafting, with customer ordering, document uploads, fee calculation, order tracking, and an administration interface.

Repository: https://github.com/pradeep1992official/StampVendorWebsite

## Features

- Guided order intake for property, owner, tenant, agreement terms, and supporting documents.
- Rental agreement document generation and PDF utilities.
- Fee calculation and pricing display.
- Customer order history and tracking.
- Google sign-in through Firebase Authentication.
- Firebase Firestore and Storage integration.
- Administration interface for managing orders.
- Razorpay order creation and signed payment webhook handling.
- English and Tamil translation resources.
- Contact, FAQ, pricing, and policy pages.

Feature availability depends on configuration. A working preview does not confirm that authentication, payments, or database operations are fully configured.

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 15, App Router |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication and data | Firebase Authentication, Firestore, Storage |
| Payments | Razorpay HTTP API and webhook |
| Documents | jsPDF, html2canvas |
| Checks | ESLint and Node.js test runner |

## Local setup

Use Node.js 22 and npm to match the reported AI Studio migration environment.

```sh
git clone https://github.com/pradeep1992official/StampVendorWebsite.git
cd StampVendorWebsite
npm install
```

Create `.env.local` from `.env.example`. On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

On macOS or Linux:

```sh
cp .env.example .env.local
```

Fill in the required settings, then start the application:

```sh
npm run dev
```

Open http://localhost:3000, or the address printed by the development server.

When using npm, commit the generated `package-lock.json` so other environments use the same dependency versions. Once it exists and matches `package.json`, use `npm ci` for reproducible installs.

## Environment variables

Configure these in `.env.local` for local development and in the hosting environment's secrets/settings for deployed environments.

| Variable | Purpose |
| --- | --- |
| `RAZORPAY_KEY_ID` | Razorpay key ID used to create payment orders |
| `RAZORPAY_KEY_SECRET` | Server-side Razorpay API secret |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for validating payment webhook signatures |
| `GEMINI_API_KEY` | Gemini API access where Gemini features are used |
| `APP_URL` | Application URL for integrations that need an absolute URL |

The GitHub `.env.example` inspected during README preparation lists only `GEMINI_API_KEY` and `APP_URL`. Add the Razorpay variable names to that template if they are not yet present, without adding real credentials.

Missing Razorpay API credentials cause the payment creation endpoint to return an unavailable response. The webhook also requires its own secret.

Never commit real secrets or add secret keys to browser-visible variables. `.env.local` is excluded by the repository's existing `.gitignore`.

## Firebase configuration

`lib/firebase.ts` loads client configuration from `firebase-applet-config.json` and uses its `firestoreDatabaseId` when initializing Firestore.

Before using the application:

1. Confirm the Firebase project, Storage bucket, and Firestore database ID are the intended ones.
2. Enable Google sign-in and authorize the domains used for local development and hosting in Firebase Authentication.
3. Review and deploy `firestore.rules` and `storage.rules` to the intended project through your Firebase deployment setup or console.
4. Test customer and administrator access, uploads, and database reads/writes.

AI Studio migration may provision or select an applet database. Verify its identity before using existing customer data. Environment variables alone do not replace the Firebase JSON configuration used by this repository.

## Business configuration

| File | Purpose |
| --- | --- |
| `src/config/vendor.ts` | Vendor identity, contact details, and vendor fee placeholders |
| `src/config/pricing.ts` | Pricing configuration |
| `src/config/admin.ts` | Administrator email and UI authorization helper |
| `firestore.rules` | Database access rules |
| `storage.rules` | Upload access rules |

Replace remaining vendor placeholders with verified business information. Keep administrator settings consistent with access rules; a client-side email check alone does not enforce database permissions.

## Project structure

```text
app/                          Pages, layouts, and API routes
  api/payment/create-order/   Razorpay order endpoint
  api/payment/webhook/        Signed payment webhook endpoint
  admin/                      Administration interface
  order/                      Customer order intake
  my-orders/                  Customer order history
  track/                      Order tracking
  rent-agreement/             Rental agreement page
components/                   Shared UI and order/agreement components
hooks/                        Shared React hooks
lib/                          Firebase, services, document utilities, translations
src/config/                   Vendor, pricing, and administrator settings
tests/                        Validation, fee, rules, and document tests
firebase-applet-config.json   Firebase client configuration
next.config.ts               Next.js configuration
firestore.rules              Firestore access rules
storage.rules                Firebase Storage access rules
```

## Development checks

```sh
npm run lint
npm test
npm run build
```

The test command covers validation, fee calculation, security rule validation, and agreement document tests. These checks do not replace testing real Firebase and Razorpay integrations.

To run a production build locally:

```sh
npm run build
npm run start
```

## AI Studio, Antigravity, and VS Code workflow

Use GitHub as the shared source of truth and finish one editing session before handing the project to another tool.

### AI Studio startup

For the AI Studio environment described in the migration report, use this development script in `package.json`:

```json
"dev": "next dev -p 3000 -H 0.0.0.0"
```

This binds the development server to port 3000 on all interfaces. The GitHub copy inspected during README preparation still uses `next dev`; commit the migration changes when ready to keep the environments aligned.

### Handing work between tools

1. Review and save AI Studio changes to GitHub.
2. In your local checkout, save any pending work and pull the latest connected branch.
3. Open the checkout in VS Code and Antigravity. Use Antigravity Local mode for sequential edits in that folder, or a separate worktree for isolated work.
4. Make changes, run the development checks, and commit and push them.
5. Before continuing in AI Studio, update its files from the latest GitHub version.

If AI Studio offers a pull/update option, use it and verify the connected branch. If it only offers **Force push**, that action sends AI Studio's code to GitHub and may replace the branch; it does not import local changes.

If pulling is unavailable, import the updated repository into a fresh AI Studio project. ZIP upload into an existing project is a manual alternative: test it on a copy first, check that files are at the project root, and reconcile deleted or renamed files. ZIP upload should not be treated as Git synchronization.

For larger local changes, create a feature branch and merge it into the branch connected to AI Studio after review:

```sh
git switch -c feature/describe-your-change
```

Ask AI tools to preserve the existing Next.js architecture, routes, authentication, pricing, validation, and document generation while making the requested change.

## Troubleshooting

| Problem | Checks |
| --- | --- |
| Development server does not start | Read the first terminal error, check Node.js and dependency installation, and confirm `package.json` is at the project root |
| AI Studio preview cannot connect | Confirm the dev server uses the port and host required by that environment |
| ZIP import does not behave correctly | Check for an extra `StampVendorWebsite-main` folder and stale files from the previous copy |
| Google sign-in fails | Check the sign-in provider and authorized domains in the intended Firebase project |
| Firestore or uploads fail | Check database ID, bucket configuration, authentication, and deployed access rules |
| Payments are unavailable | Configure the Razorpay API credentials and webhook secret, then test with Razorpay test credentials |
| Edits do not appear during development | Check whether `DISABLE_HMR=true` is disabling file watching; restart the development server after edits |

## Release checks

- Run lint, tests, and the production build.
- Verify vendor information and remaining placeholders.
- Confirm the intended Firebase project and access rules.
- Exercise sign-in, order submission, uploads, tracking, and agreement generation.
- Verify payment creation and webhook processing in a test environment.
- Configure server secrets in the target hosting environment.

## Documentation status

This README was prepared from the GitHub repository and the supplied AI Studio migration report. Migration changes may not yet be committed to GitHub. Application checks were not executed as part of preparing this documentation.
