<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into billy. The setup covers client-side initialization via `instrumentation-client.ts` (Next.js 15.3+ pattern), a server-side singleton client in `lib/posthog-server.ts`, reverse-proxy rewrites in `next.config.ts` to route PostHog traffic through `/ingest`, and user identification at both client and server layers. Event tracking spans the full user lifecycle — from waitlist join and signup through onboarding, invoice creation, PDF export, and account actions. This run added `google_sign_in_initiated` tracking on the signup page and server-side `invoice_saved` tracking to the invoices API route.

| Event | Description | File |
|---|---|---|
| `google_sign_in_initiated` | User clicks "Continue with Google" on login page | `app/(auth)/login/page.tsx` |
| `google_sign_in_initiated` | User clicks "Continue with Google" on signup page | `app/(auth)/signup/page.tsx` |
| `user_signed_up` | User successfully creates an account via email (server-side) | `app/auth/actions.ts` |
| `user_logged_in` | User successfully signs in via email (server-side) | `app/auth/actions.ts` |
| `onboarding_completed` | User completes the profession onboarding modal | `components/editor/editor-shell.tsx` |
| `invoice_pdf_exported` | User exports an invoice as PDF from the editor toolbar | `components/invoice/toolbar.tsx` |
| `invoice_reset` | User clears the current invoice and starts fresh | `components/invoice/toolbar.tsx` |
| `template_selected` | User changes the invoice template | `components/invoice/template-selector.tsx` |
| `waitlist_joined` | User submits their email to join the waitlist | `components/waitlist/waitlist-dialog.tsx` |
| `invoice_deleted` | User confirms deletion of an invoice from the dashboard | `app/dashboard/page.tsx` |
| `invoice_duplicated` | User duplicates an existing invoice from the dashboard | `app/dashboard/page.tsx` |
| `invoice_status_updated` | User cycles an invoice status (draft → sent → paid) | `app/dashboard/page.tsx` |
| `pdf_generated` | Server successfully generates and saves a PDF | `app/api/generate-pdf/route.ts` |
| `invoice_saved` | Server creates a new invoice record | `app/api/invoices/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/456900/dashboard/1677523)
- [New Signups (Last 30 Days)](https://us.posthog.com/project/456900/insights/nv2EfYbP)
- [PDFs Generated](https://us.posthog.com/project/456900/insights/VZmO5M2k)
- [Invoice Actions](https://us.posthog.com/project/456900/insights/EqcEBeqx)
- [Signup → Onboarding → PDF Export Funnel](https://us.posthog.com/project/456900/insights/USQGevL5)
- [Waitlist Joins](https://us.posthog.com/project/456900/insights/uZbKODK3)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
