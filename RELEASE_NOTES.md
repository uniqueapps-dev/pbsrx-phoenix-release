# PBSRx Phoenix v7.6.7-RC1
## Release Notes — Operational Stabilization Release

**Release Date:** July 2026  
**Release Type:** Release Candidate — Soft Go-Live Authorized  
**SHA-256 (index.html):** e282d1d54fa466d8b533729b4ded25d9c43617667b0f7e8db2d21de0c27cf896

---

### 1. Executive Summary

PBSRx Phoenix RC1 is the first production-quality release of PBSRx under the Project Phoenix programme. It integrates every approved Phoenix enhancement while preserving all trusted pharmacy workflows. This release is authorized for Soft Go-Live at D-Glopa Pharm LTD.

The release does not contain migrated inventory. Inventory migration is performed through the built-in Phoenix Migration Engine (Intake → PID MIGRATE tab) after deployment.

---

### 2. Version

**v7.6.7-RC1**  
Built from: index-002d.html (PX-MIG-002D output)  
Previous: v7.6.7-002d

---

### 3. Files Modified / Added

| File | Type | Status |
|---|---|---|
| index.html | Main application | Modified from 002d — RC1 patches applied |
| sw.js | Service Worker | New — offline-first PWA caching |
| manifest.json | PWA Manifest | New — install-to-homescreen configuration |
| RELEASE_NOTES.md | Documentation | New — this document |
| icons/ | App icons | Required — place 192x192 and 512x512 PNG icons here |

---

### 4. New Features (RC1 Additions)

**Dry Run Mode (Preview Migration)**
Before running the live migration, tap "Preview (Dry Run)" to validate the PID CSV without writing any data. Shows product count, error count, owner/consignment split, and expired items estimate.

**Migration History Register**
Every successful migration session is permanently recorded in PBSRx. Session ID, timestamp, operator, products created, stock batches, warnings, and rollback availability are all stored. Visible in Intake → PID MIGRATE → Migration History.

**Migration Certificate**
A permanent digital certificate is issued after every successful migration. The certificate includes the Session ID, dataset version, all migration statistics, and rollback reference.

**Phoenix Guide (Guide → 🏠 Phoenix tab)**
A complete pharmacist-facing guide explaining shelf location, Review Workspace, Product Completeness, PID migration, dry run, and the Soft Go-Live workflow.

**Administrator Guide (Guide → 🔧 Admin tab)**
A separate admin guide covering backup, restore, rollback, CSV preparation, troubleshooting, and recovery procedures.

**PWA Service Worker**
Offline caching via sw.js. The app can now be installed to the Android home screen and opens without an internet connection (though AI Snap and Coach features require connectivity).

---

### 5. Bug Fixes

**Swipe Navigation (Critical fix — 6 issues resolved)**

| Bug | Fix |
|---|---|
| Double variable declaration (variable shadowing) | Removed inner `var _swTouchX/Y` inside `initSwipe()` — uses outer scope |
| Android left-edge system back gesture triggering navBack | Swipe is cancelled if it originates within 20px of left edge |
| Overlay (.ov) bleeds into swipe detection | `.ov` elements excluded from swipe tracking in both touchmove and touchend |
| Minimum distance too low (60px) allowing accidental back | Raised to 80px minimum travel distance |
| Missing velocity guard | Swipe must be 2× more horizontal than vertical |
| Android popstate (back button) not triggering navBack | `popstate` handler now calls `navBack()` after pushing history state |

---

### 6. Stability Improvements

- Page transitions: 0.15s fade-in animation for smoother navigation feel
- Buttons: `touch-action: manipulation` prevents double-tap zoom on all action buttons
- Nav bar: `-webkit-tap-highlight-color: transparent` removes tap flash on Android
- Swipe: `_swCancelled` flag prevents touchend from firing after a cancelled gesture
- Guide tab strip: horizontally scrollable to accommodate Phoenix and Admin tabs

---

### 7. Documentation Updates

- Guide page now has 9 tabs (was 7): added Phoenix RC1 and Administrator Guide
- Phoenix Guide covers all RC1 features in plain language for pharmacists
- Administrator Guide covers backup, restore, rollback, CSV prep, and troubleshooting
- Phoenix Issue Log template included in Admin Guide

---

### 8. Protected Features (unchanged)

Per Phoenix Constitution and Chesterton's Fence — the following are confirmed unchanged:

✓ POS basket, payment, receipt, FEFO depletion  
✓ Sales history and reporting  
✓ Bulk Receive / Receive vs PO / Quick Log workflows  
✓ Supplier ledger and AP management  
✓ Cash Desk and bucket allocation  
✓ Dashboard, break-even, Intelligence  
✓ Reorder Centre and Reorder Brain  
✓ Coach AI and daily checklist  
✓ Multi-unit engine (getProdUnits)  
✓ getCurStock() and getSupplierBalance()  
✓ FEFO depletion in all sale pathways  

---

### 9. Verification Results

| Check | Result |
|---|---|
| JavaScript syntax | CLEAN ✓ |
| Review Workspace operational | ✓ |
| Shelf Location operational | ✓ |
| Product Completeness operational | ✓ |
| PID MIGRATE operational | ✓ |
| Dry Run operational | ✓ |
| Migration Snapshot operational | ✓ |
| Rollback operational | ✓ |
| Migration Certificate operational | ✓ |
| Migration History operational | ✓ |
| Phoenix Guide included | ✓ |
| Admin Guide included | ✓ |
| Swipe navigation fixed | ✓ (6 issues resolved) |
| Navigation stability | ✓ |
| Existing workflows preserved | ✓ |
| Backward compatibility | ✓ |
| Empty operational database | ✓ |
| Service Worker registered | ✓ |
| manifest.json present | ✓ |

---

### 10. Known Limitations

**Selling prices absent from PID v1.0.** After migration, 469 products will have `sellPrice: 0`. The Review Workspace surfaces these as Priority 1 tasks. Complete the pricing sprint before the first sale.

**isFastMover defaults to false.** Stock Pulse shows nothing until the pharmacist flags fast-moving products. Do this during the first week.

**Barcode and NAFDAC absent from PID v1.0.** AI Snap enrichment pathway populates these over time during normal intake operations.

**Icons directory must be populated.** The manifest.json references `icons/icon-192.png` and `icons/icon-512.png`. These are not included in RC1. Place PNG icons here before attempting to install the PWA to the Android home screen.

**localStorage limit (~5MB on Android).** PBSRx monitors storage and warns at 3.5MB. With 469 products + opening stock, the initial footprint is approximately 150-250KB — well within limits. The monitor will warn before capacity is approached.

---

### 11. Soft Go-Live Readiness

**Status: AUTHORIZED FOR SOFT GO-LIVE WITH CONDITIONS**

**Pre-go-live conditions (2 items):**
1. Complete pricing sprint — set selling prices for daily-dispensing products (Priority 1 Review Workspace tasks)
2. Physically segregate the 25 expired items from active stock before opening

**Soft Go-Live protocol (14 days):**
- Days 1-7: Full PBSRx operation; all sales through POS; all receipts through Bulk Receive
- Days 8-14: Enrichment sprint; isFastMover flags; first S11 stocktake
- Phoenix Issue Log maintained throughout; non-critical issues batched for next work package

---

### 12. Deployment Instructions

**Standard deployment (localhost or file://):**
1. Unzip `PBSRx-Phoenix-v7.6.7-RC1.zip`
2. Copy `index.html`, `sw.js`, `manifest.json`, and `icons/` to your web server or local directory
3. Open `index.html` in Chrome on Android
4. Tap the three-dot menu → "Add to Home Screen" for PWA installation

**GitHub Pages deployment:**
1. Upload all files to your GitHub Pages repository root
2. The PWA will be accessible at `https://[username].github.io/[repo]/`
3. Service Worker will activate on the second page load

**File-based deployment (no server):**
1. Open `index.html` directly from the phone's file manager
2. Service Worker will not activate in file:// protocol (this is expected)
3. All features work normally except offline caching

---

### 13. Integrity Hash

**SHA-256 (index.html):** `e282d1d54fa466d8b533729b4ded25d9c43617667b0f7e8db2d21de0c27cf896`

Verify before deployment by computing the SHA-256 of your `index.html` and confirming it matches.

---

*PBSRx Phoenix v7.6.7-RC1 — Operational Stabilization Release*  
*Project Phoenix · D-Glopa Pharm LTD. · July 2026*
