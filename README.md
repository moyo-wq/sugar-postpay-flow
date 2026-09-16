# Sugar — Post-payment flow (standalone local demo)

A self-contained mock of the new post-payment experience. Runs entirely on
localhost — no backend, no real payments, no analytics. All state lives in the
browser's localStorage.

## Run it

```bash
npm run dev
```

> `node_modules` is a symlink to `~/code/sugar-surveynz/node_modules` (the main
> repo's install) because the disk was full. If you move this folder or delete
> the main repo, free some space and run `npm install` here.

## The flow

1. **`/` — Fake pay page.** Enter any email (this decides which sign-in options
   you'll see) and click **Pay $49.00** — a fake payment runs, nothing is charged.
2. **`/congrats`** — Confetti, "Congratulations! Let's go get that money",
   "$3,000 back in your pocket or your money back", **Let's Go!**
3. **`/sign-in`** — options depend on the email's provider:
   - Gmail / Microsoft (outlook, hotmail, live, msn): **Sign in via email** + **Sign in via bank**
   - iCloud (icloud, me, mac): **Sign in via bank** only
   - Anything else: **Sign in via bank** + **Sign in with your account manager**
4. **`/connecting`** — fake "connecting to Gmail/Outlook" or "connecting to your
   bank" screen (email/bank paths only; account-manager path skips straight to
   step 5).
5. **`/contact-method`** — "How would you prefer your account manager to contact
   you?" Email / Text me / Call me.
   - **Email** → uses the email from checkout → confirmation.
   - **Text** → `/phone` (enter number) → confirmation.
   - **Call** → `/phone` → `/call-time` ("Now", "In 30 minutes", then 1.5-hour
     ranges 9:00 AM – 9:00 PM NZ) → confirmation.
6. **`/confirmation`** — "Your account manager will email you in 5 minutes" /
   "…text you in 5 mins" / "…call you {in a couple of minutes | in 30 mins |
   between X and Y}". **Continue** →
7. **`/dashboard`** — timeline:
   - ✅ Paid
   - ✅ Signed in with {Email | your bank | your account manager}
   - ✅ Information received
   - 🟡 Call booked / Account manager messaged you — in progress
   - ⚪ $3,000 savings plan sent
   - ⚪ $3,000 savings plan approved
   - ⚪ Savings plan executed
   - ⚪ Others…

**Reset demo state** on the pay page clears everything.

## Where things live

- `src/screens/*` — one folder per page, in flow order: FakePay, Congrats,
  SignIn, Connecting, ContactMethod, PhoneNumber, CallTime, Confirmation,
  Dashboard.
- `src/lib/flowState.ts` — flow state (email, provider detection, sign-in
  method, contact method, phone, call time) persisted in localStorage, plus the
  call-time options and copy helpers.
- `src/components/ui.tsx` — shared Sugar-styled pieces (page/card/buttons/confetti).
