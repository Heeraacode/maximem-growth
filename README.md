# Vity Referral Loop - Growth Experiment

A complete PLG referral system prototype for [Maximem Vity](https://maximem.ai) - capturing "wow moments" and converting them into viral growth.

**Live Demo:** [maximem-growth.vercel.app](https://maximem-growth.vercel.app)

---

## What's This?

This is a working prototype demonstrating a product-led referral loop for Maximem Vity. The experiment captures users at their "wow moment" - when Vity's context injection delivers visible value - and converts that delight into viral sharing.

Built as a Growth Engineer application demo for Gaurav Dadhich @ Maximem AI.

---

## Features

- **Referral Modal** - Triggers after detecting user engagement (3+ messages)
- **A/B Test Variants** - 4 different copy/messaging approaches to test
- **Analytics Dashboard** - Funnel metrics, conversion tracking, live event stream
- **Cross-Platform** - Works on ChatGPT, Claude, Gemini, Perplexity, and more
- **Privacy-First** - Aligned with Maximem's ZDR (Zero Data Retention) philosophy

---

## Pages

| Page | Description |
|------|-------------|
| [/](https://maximem-growth.vercel.app) | Landing page with project overview |
| [/preview.html](https://maximem-growth.vercel.app/preview.html) | Interactive modal A/B variants |
| [/dashboard.html](https://maximem-growth.vercel.app/dashboard.html) | Analytics dashboard mockup |
| [/docs.html](https://maximem-growth.vercel.app/docs.html) | Full strategy document |

---

## Userscript Installation

Want to test the actual referral modal on AI chat sites?

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create a new script and paste contents of `vity-referral-simulator.user.js`
3. Save and visit any supported site (chatgpt.com, claude.ai, etc.)

**Keyboard Shortcuts:**
- `Ctrl+Shift+M` - Manually trigger modal
- `Ctrl+Shift+V` - Cycle through A/B variants

---

## A/B Test Variants

| Variant | Name | Headline |
|---------|------|----------|
| A | Emotional | "Your AI Remembered" |
| B | Value-First | "You Just Saved 5 Minutes" |
| C | Social Proof | "12,847 Users Share Daily" |
| D | Scarcity | "Beta Referral Bonus" |

---

## Growth Thesis

> The moment Vity successfully recalls context is a **peak emotional moment**. Users think: "Wow, it actually remembered!" This is the highest-intent moment to ask for a referral.

**Trigger:** 3 messages in chat (proxy for successful context injection)

**Target Metrics:**
- 8-12% referral click rate
- 0.15-0.25 viral coefficient

---

## Tech Stack

- Vanilla HTML/CSS/JS (no frameworks)
- Chart.js for dashboard visualizations
- Tampermonkey userscript for cross-site injection

---

## Author

**Heeraa Ananthan** - Growth Engineer Applicant @ Maximem AI

- X: [@capyheer](https://twitter.com/capyheer)
- Email: growth@heeraaa.in
- Email: heeraaananthanmit@gmail.com

