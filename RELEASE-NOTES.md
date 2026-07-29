# PBSRx Phoenix v7.6.7-RC3.9
## Release Notes — Production Deployment

**Release date:** 2026-07-29  
**Platform:** D-Glopa Pharm LTD. — Pharmacy Business System  
**Certification status:** ✅ CERTIFIED — 79/79 checks across 9 domains  
**Migration certificate:** PHX-MIG-20260724-560  

---

## What this release is

PBSRx Phoenix v7.6.7-RC3.9 is the first certified production build of the PBSRx Phoenix platform. It is the result of Project Phoenix — a structured stabilization programme covering five engineering sprints:

- **Sprint A — Stabilization:** Product Identity (PIR-002A), Selling Units (PIR-001)
- **Sprint B — Platform fixes:** Review Workspace scroll and stale queue (PIR-012, PIR-013), Inventory synchronization (PIR-014)
- **Sprint C — Consistency:** Stock Pulse enrollment for all ingestion paths
- **Sprint D — Platform Hardening:** Architecture audit (20 findings), Platform Standards consolidation, Engineering Polish
- **Sprint E — Certification:** 79-check automated certification across 9 domains

---

## Migration status

469 products migrated from QuickBooks to PBSRx Phoenix on 2026-07-24.

| Category | Count |
|---|---|
| Owner stock products | 355 |
| Consignment products | 114 |
| Expired (archived) | 25 |
| Total product records | 469 |

Migration certificate: **PHX-MIG-20260724-560**

---

## Platform Standards implemented

| Standard | Description | Status |
|---|---|---|
| PST-001 | Product Identity — String IDs throughout | ✅ |
| PST-002 | Pricing Independence — no automatic price from cost | ✅ |
| PST-003 | Semantic Product Vocabulary | ✅ |
| PST-004 | Canonical Packaging Resolver (`getProdUnits`) | ✅ |
| PST-005 | Canonical Product Ingestion — all paths enroll products | ✅ |
| PST-006 | Operational vs Commercial Classification | ✅ |
| PST-007 | Event Scope Principle — delegates on narrowest stable ancestor | ✅ |
| PST-008 | Idempotent Registration — all listeners guarded | ✅ |

---

## Key capabilities

- **POS** — Full point-of-sale with multi-unit selling, FEFO depletion, receipt generation
- **Stock Pulse** — Live inventory monitoring for all enrolled products
- **Intake** — Bulk Receive, AI Snap (Claude vision), Barcode scan, Supplier management
- **Review Workspace** — 214-task Product Data Quality Centre with inline editing
- **Reorder Brain** — Intelligent reorder suggestions with WhatsApp integration
- **Intelligence** — Sales reports, margin analysis, cash desk reconciliation
- **Coach** — Daily briefing and pharmacy management guidance
- **PBSRx.Diagnostics** — Permanent developer diagnostic framework (Guide → Settings → Developer Tools)

---

## Known deferred items

| Item | Description | Planned sprint |
|---|---|---|
| D-015 | Full diagnostic coverage for all subsystems | Diagnostics Capability Sprint |

---

## Deployment instructions

### GitHub Pages deployment

1. Upload all files in this folder to your GitHub repository root or `/docs` folder
2. Enable GitHub Pages in repository Settings → Pages
3. Set source to the branch containing these files
4. The app will be available at `https://uniqueapps-dev.github.io/[repo-name]/`

### Local testing

```
# Using Python (any version)
python3 -m http.server 8080
# Then open: http://localhost:8080

# Using Node.js
npx serve .
```

### First-run checklist

- [ ] Open the app in Chrome on Android
- [ ] Sign in with Owner PIN
- [ ] Verify 469 products in Stock tab
- [ ] Navigate to Review Workspace — confirm 214 P1 tasks
- [ ] Enable diagnostics: Guide → Settings → Developer Tools → Enable
- [ ] Verify migration certificate in Intake → PID Migrate

---

## File manifest

| File | Purpose | Size |
|---|---|---|
| `index.html` | Certified application (RC3.9) | ~1.1 MB |
| `manifest.json` | PWA manifest | ~0.8 KB |
| `sw.js` | Service Worker (cache-first, versioned) | ~3 KB |
| `icon-192.png` | App icon 192×192 | ~0.7 KB |
| `icon-512.png` | App icon 512×512 | ~2.6 KB |
| `RELEASE-NOTES.md` | This document | — |

---

## Technical baseline

- **Build:** v7.6.7-RC3.9
- **Source lines:** 13,646
- **JS syntax:** Node.js `--check` validated
- **SW cache key:** `pbsrx-phoenix-v7.6.7-RC3.9`
- **Offline capable:** Yes — application shell cached on first install
- **Installable:** Yes — meets all PWA installation criteria
- **HTTPS required:** Yes (GitHub Pages provides this automatically)
