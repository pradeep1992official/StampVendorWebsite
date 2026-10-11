# Project recheck — 12 October 2026

This is a review of the local working tree, including previous security fixes and the latest branding changes. No application code was changed during this recheck. Findings below are distinct from compiler/test failures. This review does not establish the deployed site's configuration or prove the absence of every possible defect.

## Checks executed

- Project-wide ESLint: passed.
- TypeScript (`npx tsc --noEmit`): passed.
- Application/unit/mocked-route tests: 50 passed.
- Actual Firebase Firestore/Storage emulator rules tests: 8 passed, using the demo project.
- Isolated production build: exit 0; generated all 33 routes. Windows could not copy the junction-linked node_modules into standalone output (EPERM). Compilation and prerendering passed; that standalone bundle is not verified as deployable.
- Dependency audit: 24 flagged package entries (17 high, 7 moderate); production-only audit: 6 entries (5 high, 1 moderate). These counts include parent/transitive entries and are not counts of distinct exploitable flaws.

## Remaining findings

### 1. High — Public tracking uses knowledge of a phone number as authorization

`app/api/orders/track/route.ts:5` does not verify a Firebase token, OTP or an unguessable tracking secret. An order ID plus an owner/tenant phone number returns names, property city/type, courier data and a free-text correction message. Different 404 and 403 responses reveal whether an order ID exists; there is no application rate limiter. An attacker who obtains those details can read tracking data without proving they are the customer. No actual compromise was observed.

Fix: require the existing signed-in account and enforce ownerUid/admin access, or design a separately authorized public tracking link/OTP flow. Return only required tracking fields, use a generic lookup failure, and enforce shared rate limits.

### 2. High-priority dependency maintenance — Vulnerable versions remain in the lockfile

`firebase@12.19.0` includes `@grpc/grpc-js@1.9.16`; `next@15.5.27` includes `postcss@8.4.31`. The project's direct PostCSS is newer (`8.5.29`), but it does not replace Next's nested version. Development tooling adds further flagged entries.

The gRPC advisory concerns certain server TLS/authentication configurations; this application does not appear to create such a gRPC server, so a directly exploitable production path was not established. PostCSS advisories concern processing attacker-controlled CSS/source maps; no application route accepting CSS was found. Treat the audit severity as dependency risk, not proof that this site's users can exploit every entry.

Fix: update compatible dependency families, verify the resulting installed tree, rerun the audit and all checks. Do not apply `npm audit fix --force` blindly: its proposed changes include major upgrades and downgrades.

Sources: [gRPC advisory](https://github.com/advisories/GHSA-m9gg-hp2v-232j), [PostCSS advisory](https://github.com/advisories/GHSA-r28c-9q8g-f849).

### 3. Medium — Enquiry spam controls can be bypassed

`app/api/contact/route.ts:6` uses a process-local map keyed by phone plus the first 30 message characters. Changing either avoids the duplicate check; separate server instances do not share the map. The entry is added only after the write, so parallel duplicates can pass. More significantly, `firestore.rules:55` permits unauthenticated direct enquiry creation, bypassing the API entirely. The rule checks phone length but not numeric/mobile format and does not constrain district size/type.

Fix: move enquiry creation to a controlled server route, deny anonymous direct collection writes, add shared abuse controls and validate the complete payload. Preserve the public contact form through that route.

### 4. Medium — Allowed package prices can contradict the itemized breakdown

`src/config/pricing.ts:26` permits a Chennai Rs.100-stamp package priced at Rs.100. `components/PriceBreakdownCard.tsx:37` and `app/api/orders/calculate-fee/route.ts` still allocate Rs.50 courier and clamp the service charge to zero. Reproduced locally: accepted total Rs.100, displayed components Rs.100 stamp + Rs.50 courier + Rs.0 service = Rs.150. The same issue affects other packages below stamp plus assumed courier.

Fix: use an explicit component schedule that sums to the package total, or raise package minimums to cover all fixed components and update both application validation and Firestore rules consistently.

### 5. Medium — Displayed pricing may differ from the amount charged

`lib/pricing-service.ts:11` falls back to published defaults when Firestore reads fail. `components/PriceBreakdownCard.tsx:29` silently retains defaults if saved prices are invalid. The fee API labels the result confirmed even when it came from a read failure. Checkout independently loads current server pricing, and the checkout request does not include a reviewed-price acknowledgement. A pricing change between review and checkout, or a stale/default display, can start checkout for a different amount.

Fix: make unavailable/invalid pricing visible, prevent checkout until a current quote is reviewed, and require confirmation when the server amount changes. Continue rejecting invalid pricing on the server.

### 6. Medium — Checkout does not validate the full agreement payload

`app/api/payment/phonepe/create-order/route.ts:62` whitelists top-level details and checks that required sections are objects, but does not validate their actual names, phones, addresses, amounts, dates, enums or boolean types. Empty section objects pass that check. `firestore.rules:100` also allows customer-created orders without complete agreement details. Bypassing the browser can therefore save malformed orders and reach checkout for an unusable agreement. This does not bypass the server's payment amount verification.

Fix: share agreement schema validation between the form and server; validate the complete merged saved/reviewed order before any checkout or credit reservation.

### 7. Low — Malformed requests and invalid tokens are reported as server failures

Several API routes catch JSON parsing and token verification failures in their generic 500 handler. For example, checkout/status invalid tokens and tracking malformed/null bodies can return 500. Tracking/status order IDs are not validated as strictly as checkout IDs, so invalid Firestore document paths can also become 500 responses.

Fix: classify invalid JSON/payloads as 400, invalid/expired authentication as 401, and validate document IDs before database calls. Keep 500 for actual internal failures.

## Testing and release limits

- Real PhonePe sandbox checkout, failed payments, return navigation and webhook delivery were not exercised.
- Mocked transaction tests do not prove real Firestore transaction retry behavior for checkout/referral services; the emulator suite currently tests access rules rather than those server transactions.
- The status/webhook handlers lack comprehensive direct route tests for invalid tokens/signatures, amount mismatch and duplicate/out-of-order events.
- No connected browser was available for mobile layout, keyboard navigation, authentication and full order-flow walkthroughs.
- The CI workflow exists locally; no remote Actions run was verified.
- Deployed rules, production secrets and legacy-payment reconciliation remain outside this local recheck.

The earlier unsupported clean-command issue, nested customer payment-field forgery, invalid-price/zero-total payment path, and draft Storage read/delete denial remain covered by passing regression tests. No new critical application issue was confirmed in this review.
