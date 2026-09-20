# Model and Dummy Data Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move operational data behind domain models, repository contracts, dummy implementations, and providers so admin/public screens can switch to API repositories without screen changes.

**Architecture:** Keep domain entities and repository interfaces independent of React and storage. Put seed values in `src/infrastructure/dummy`, persist mutable collections through the existing session-storage adapter, and expose them to screens through React providers. Existing ceremony-event behavior remains intact except its road validation receives the dynamic road catalog.

**Tech Stack:** Next.js App Router, React, TypeScript, sessionStorage, Playwright, existing lucide-react/CSS; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-18-model-dummy-separation-design.md`

## Global Constraints

- Do not add npm dependencies.
- Do not commit or push.
- Screens consume domain types and provider hooks; do not import dummy seed arrays in pages.
- Preserve `/id` and `/en` locale routing and both dictionaries.
- Preserve `CeremonyEvent` publication and `banjarId` ownership behavior.
- Use existing `createSessionStorageRepository<T>`; no new persistence abstraction.
- Road coordinates use `[number, number]` and require at least two valid points.
- Run typecheck, lint, build, and relevant Playwright tests before completion.

---

## File Map

**Create:**
- `src/domain/entities/banjar-profile.ts`
- `src/domain/entities/emergency-contact.ts`
- `src/domain/entities/vehicle.ts`
- `src/domain/entities/impact-stat.ts`
- `src/domain/repositories/road-repository.ts`
- `src/domain/repositories/banjar-profile-repository.ts`
- `src/domain/repositories/emergency-contact-repository.ts`
- `src/domain/rules/is-road.ts`
- `src/domain/rules/is-banjar-profile.ts`
- `src/domain/rules/is-emergency-contact.ts`
- `src/application/use-cases/road-validation.ts`
- `src/application/use-cases/banjar-profile-validation.ts`
- `src/application/use-cases/emergency-contact-validation.ts`
- `src/infrastructure/dummy/dummy-roads.ts`
- `src/infrastructure/dummy/dummy-banjar-profiles.ts`
- `src/infrastructure/dummy/dummy-emergency-contacts.ts`
- `src/infrastructure/dummy/dummy-vehicles.ts`
- `src/infrastructure/dummy/dummy-impact-stats.ts`
- `src/infrastructure/repositories/dummy-road-repository.ts`
- `src/infrastructure/repositories/dummy-banjar-profile-repository.ts`
- `src/infrastructure/repositories/dummy-emergency-contact-repository.ts`
- `src/presentation/providers/roads-provider.tsx`
- `src/presentation/providers/banjar-profile-provider.tsx`
- `src/presentation/providers/emergency-contact-provider.tsx`
- `src/presentation/providers/impact-data-provider.tsx`
- `src/app/[locale]/admin/(protected)/jalan/page.tsx`
- `src/app/[locale]/admin/(protected)/profil-banjar/page.tsx`
- `src/app/[locale]/admin/(protected)/kontak-darurat/page.tsx`

**Modify:**
- `src/data/catalog/demo-data.ts` — retain `DEMO_DATE`, `dummyAdmin`, `initialEvents`; remove `roads`.
- `src/infrastructure/storage/session-storage.ts` — add typed repository factories for roads/profiles/contacts.
- `src/application/use-cases/event-validation.ts` — accept `Road[]`; remove static road import.
- `src/presentation/providers/events-provider.tsx` — consume `useRoads()` and validate against current roads.
- `src/app/[locale]/layout.tsx` — mount new providers in dependency order.
- `src/presentation/pages/public-map-page.tsx` — use `useRoads()`.
- `src/presentation/pages/dashboard-page.tsx` — use `useRoads()`.
- `src/presentation/pages/tri-hita-karana-page.tsx` — consume `useImpactData()`, profile, and contacts.
- `src/presentation/layouts/protected-layout.tsx` — add admin navigation links.
- `src/data/i18n/id.ts`, `src/data/i18n/en.ts` — add admin labels/form feedback.
- `tests/balepath.spec.ts` — update language-switcher test if still stale; add CRUD smoke coverage.

**Test:** Existing typecheck/lint/build scripts and `tests/balepath.spec.ts`; add `tests/domain/data-validation.test.ts` only if the repository has a runnable unit-test setup. Otherwise use the existing Playwright suite plus typecheck for validation.

---

## Task 1: Add Domain Models, Contracts, and Validation

**Files:** Create the five entities, three repository interfaces, three domain rules, and three validation use-cases listed above. Modify `event-validation.ts`.

**Interfaces:**
- Produce `RoadRepository`, `BanjarProfileRepository`, `EmergencyContactRepository` with synchronous `load(): Entity[]` and `save(items: Entity[]): void`.
- Produce `isValidRoad`, `isValidRoadList`, `isValidBanjarProfile`, `isValidBanjarProfileList`, `isValidEmergencyContact`, and `isValidEmergencyContactList`.
- Change `isValidEvent(value, roads)` and `isValidEventList(value, roads)` to pass the current road catalog into `isCeremonyEvent`.

- [ ] Add exact entity types from the spec: `BanjarProfile`, `EmergencyContact`, `Vehicle`, `ImpactStat`.
- [ ] Add repository interfaces matching `EventRepository`'s synchronous `load`/`save` shape.
- [ ] Implement road validation: object, non-empty string `id`/`name`, coordinates array with at least two entries, every entry exactly two finite numbers.
- [ ] Implement profile validation: required string fields (`banjarId`, `name`, `location`, `description`, `contactName`, `contactPhone`) are non-empty after trim.
- [ ] Implement contact validation: non-empty `id`, `banjarId`, `postName`; string `phone`/`whatsapp`; boolean `verified`.
- [ ] Update event validation signatures and all direct callers to supply `Road[]`; do not import `demo-data` from validation.
- [ ] Run `npm run typecheck`; expected: PASS or only caller errors that Task 2 will resolve.

## Task 2: Move Seed Data Behind Storage Repositories

**Files:** Create dummy files/repositories and modify `session-storage.ts`, `demo-data.ts`.

**Interfaces:**
- Produce `createRoadRepository()`, `createBanjarProfileRepository()`, and `createEmergencyContactRepository()` returning the corresponding interfaces.
- Preserve the four existing road IDs/coordinates and existing event/admin seed values exactly.

- [ ] Move the four-road array into `dummy-roads.ts` as `initialRoads`.
- [ ] Add one `initialBanjarProfiles` record for `ubud-kaja`, using the existing Ubud Kaja identity/copy.
- [ ] Add one `initialEmergencyContacts` record for `ubud-kaja`, with blank phone/WhatsApp and `verified: false` to preserve the current unavailable-contact UI.
- [ ] Move the `vehicles` array into `dummy-vehicles.ts` as `initialVehicles` with `Vehicle` types.
- [ ] Move impact constants into `dummy-impact-stats.ts` as `initialImpactStat` with values `1420`, `28.4`, `30`, and `34`.
- [ ] Add storage factory functions using keys `balepath.demo.roads.v1`, `balepath.demo.banjar-profiles.v1`, and `balepath.demo.emergency-contacts.v1` and the validators from Task 1.
- [ ] Remove only `roads` from `demo-data.ts`; retain `DEMO_DATE`, `dummyAdmin`, and `initialEvents`.
- [ ] Run `npm run typecheck`; expected: failures only at old road imports/callers, resolved in following tasks.

## Task 3: Add Providers and Rewire Existing Event/Data Flow

**Files:** Create four providers; modify `events-provider.tsx`, `[locale]/layout.tsx`, `public-map-page.tsx`, `dashboard-page.tsx`.

**Interfaces:**
- `useRoads()` returns `{ roads: Road[]; ready: boolean; saveRoad(road: Road): boolean; deleteRoad(id: string): void }`.
- `useBanjarProfile()` returns `{ profile: BanjarProfile | null; ready: boolean; saveProfile(profile: BanjarProfile): boolean }`.
- `useEmergencyContacts()` returns `{ contacts: EmergencyContact[]; ready: boolean; saveContact(contact: EmergencyContact): boolean; deleteContact(id: string): void }`.
- `useImpactData()` returns `{ vehicles: Vehicle[]; impactStat: ImpactStat }` from dummy-backed read-only data; this keeps pages free of dummy imports while avoiding an unnecessary CRUD API.

- [ ] Implement `RoadsProvider` with initial seed state, deferred repository load, persistence after ready, validation, unique-ID protection, and delete behavior.
- [ ] Implement scoped profile/contact providers using `user?.banjarId`; prevent saving another banjar's record.
- [ ] Implement `ImpactDataProvider` as read-only context backed by `initialVehicles` and `initialImpactStat`.
- [ ] Mount providers so `RoadsProvider` is above `EventsProvider`; mount profile/contact/impact providers inside the authenticated-capable tree.
- [ ] Update `EventsProvider` repository validation and `saveEvent` to use current `roads`; preserve existing event list loading behavior.
- [ ] Replace direct `roads` imports in public map/dashboard with `useRoads()` and handle `ready`/empty-road state without crashing (`roads[0]` must not be assumed).
- [ ] Run `npm run typecheck` and `npm run lint`; expected: PASS.

## Task 4: Rewire Tri Hita Karana Screen to Models/Providers

**Files:** Modify `tri-hita-karana-page.tsx`; use dummy data only inside `impact-data-provider.tsx`.

- [ ] Replace local vehicle array with `useImpactData().vehicles`; preserve IDs, labels, rates, and calculator outputs.
- [ ] Replace hardcoded metric numbers with `impactStat.emissionKg`, `impactStat.idlingPercent`, `impactStat.idlingTargetPercent`, and `impactStat.ceremonyCount`.
- [ ] Read profile/contact records through hooks, selecting the configured public banjar record; keep the existing unavailable state when no verified contact exists.
- [ ] Render phone/WhatsApp links only when values are non-empty and contact is verified; retain `tel:119` fallback and map link for emergency navigation.
- [ ] Keep all bilingual UI copy in dictionaries; add no operational values to `id.ts`/`en.ts`.
- [ ] Run `npm run typecheck`, `npm run lint`, and the impact Playwright tests; expected: existing calculator/contact behavior remains PASS.

## Task 5: Add Admin Navigation and Road Management Screen

**Files:** Modify `protected-layout.tsx`, `id.ts`, `en.ts`; create `jalan/page.tsx`; use existing admin styling conventions.

- [ ] Add translated nav entries and links for `/admin/jalan`, `/admin/profil-banjar`, and `/admin/kontak-darurat`.
- [ ] Build the road screen with `useRoads()`: list current roads, add/edit form, delete action, and empty/loading states.
- [ ] Parse coordinate textarea as one `lat,lng` pair per line; reject malformed/non-finite pairs and fewer than two points before calling `saveRoad`.
- [ ] Generate a stable client ID for new roads; preserve ID while editing; clear form after successful save.
- [ ] Show validation/save/delete feedback with translated strings and accessible labels.
- [ ] Run typecheck/lint and a focused Playwright smoke check: login → open Ruas Jalan → create a road → confirm it appears in the list.

## Task 6: Add Banjar Profile and Emergency Contact Admin Screens

**Files:** Create `profil-banjar/page.tsx`, `kontak-darurat/page.tsx`; modify dictionaries and any shared admin CSS only if required.

- [ ] Build profile form for the logged-in `banjarId` with fields matching `BanjarProfile`; load current profile, save through `useBanjarProfile()`, and show success/error feedback.
- [ ] Build contact list/form with `postName`, `phone`, `whatsapp`, and `verified`; scope all mutations to the logged-in banjar; support add/edit/delete.
- [ ] Add translated labels, placeholders, validation messages, success messages, and navigation copy in both dictionaries.
- [ ] Keep phone/WhatsApp values as strings; do not normalize them in the screen beyond trim/required validation.
- [ ] Run typecheck/lint and focused Playwright smoke checks for profile save and contact create/edit/delete.

## Task 7: Verify User/Admin Synchronization and Regression Suite

**Files:** Modify `tests/balepath.spec.ts` only; no production changes unless verification exposes a defect.

- [ ] Add an isolated test context/storage reset strategy so mutable sessionStorage from one test cannot pollute another test.
- [ ] Test admin-created road appears in the road-management list and is available in the event form.
- [ ] Test published event still appears on public map/calendar and draft remains hidden.
- [ ] Test profile/contact admin save is reflected by the public Tri Hita Karana screen after reload; retain unverified fallback assertions.
- [ ] Update the language-switcher test to open the menu and click the selected locale entry, not expect navigation on the trigger click alone.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm test`; report exact failures if environment/browser setup prevents execution.
- [ ] Manually inspect changed presentation files to confirm no page imports `@/infrastructure/dummy/*` directly.

## Completion Criteria

- Public map and admin event form use the same provider-backed road catalog.
- New road/profile/contact data survives reload through sessionStorage and is visible in the intended user screen.
- Existing event publication, locale routing, bilingual copy, and calculator outputs remain intact.
- Dummy seed data is isolated under `src/infrastructure/dummy`.
- API migration requires repository implementation/wiring changes, not screen changes.
- Verification commands are run and results reported honestly.
