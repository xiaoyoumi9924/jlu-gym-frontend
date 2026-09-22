# Persistent Multiple Bookings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist every locally created booking across browser restarts and let users view or cancel each record independently.

**Architecture:** Replace the single `sessionStorage` object with a `localStorage` array keyed by order number. Keep storage logic in `src/data/mockBooking.js`, migrate the legacy session record on first read, and pass the selected order number through a route parameter so list and detail pages remain decoupled.

**Tech Stack:** Vue 3, Vue Router 4, browser Web Storage, Node `node:test`, Vitest, `@vue/test-utils`

**Spec:** `docs/superpowers/specs/2026-09-22-persistent-multiple-bookings-design.md`

## Global Constraints

- Every new booking is appended and never overwrites an older booking.
- Cancellation changes only `status`; no record is deleted.
- No clear or delete function is exposed in the UI.
- Booking data stays in browser `localStorage` and is never sent to a server.
- A valid legacy `sessionStorage` booking migrates once when no new list exists.

## Review Focus

- Corrupt or non-array local data must return an empty list without crashing.
- A missing order number must not cancel or display another booking.
- Cancelling one order must leave every other order unchanged.
- Legacy migration must not duplicate a record after repeated reads.
- An unknown detail route must show the empty-detail state.

---

### Task 1: Persistent booking collection

**Files:**
- Modify: `src/data/mockBooking.js`
- Test: `tests/booking-feature.test.mjs`

**Interfaces:**
- Produces: `saveMockBooking(input)`, `getMockBookings()`, `getMockBooking(orderNo)`, `cancelMockBooking(orderNo)`
- Storage: `localStorage['jlu-gym-mock-bookings']` contains a JSON array

- [ ] **Step 1: Replace the single-record tests with failing collection tests**

Add tests that install in-memory `localStorage` and `sessionStorage`, save two literal bookings, and assert `getMockBookings()` returns both order numbers in insertion order. Add separate tests for targeted cancellation, invalid stored JSON, and one-time migration of the legacy `jlu-gym-mock-booking` value.

- [ ] **Step 2: Run the storage tests and verify RED**

Run: `node --test tests/booking-feature.test.mjs`

Expected: FAIL because `getMockBookings` does not exist and current saves overwrite one session record.

- [ ] **Step 3: Implement the collection API**

Use these signatures:

```js
export function getMockBookings() {}
export function getMockBooking(orderNo) {}
export function saveMockBooking(input) {}
export function cancelMockBooking(orderNo) {}
```

Parse only arrays from `localStorage`, append new records, find/update by exact `orderNo`, and migrate a valid legacy object only when the new storage key is absent. Remove `clearMockBooking()` so production code exposes no clear operation.

- [ ] **Step 4: Run the storage tests and verify GREEN**

Run: `node --test tests/booking-feature.test.mjs`

Expected: all Node tests pass with no failures.

- [ ] **Step 5: Commit the storage collection**

Run: `git add src/data/mockBooking.js tests/booking-feature.test.mjs docs/superpowers && git commit -m "feat: persist multiple bookings locally"`

### Task 2: Multi-record list and order-specific detail

**Files:**
- Modify: `src/views/MyBookingsView.vue`
- Modify: `src/views/BookingDetailView.vue`
- Modify: `src/router/index.js`
- Create: `tests/my-bookings.test.js`

**Interfaces:**
- Consumes: collection API from Task 1
- Produces: route `/my-bookings/detail/:orderNo` and one card per stored booking

- [ ] **Step 1: Write failing component tests**

Mount `MyBookingsView` with two local bookings and a memory router. Assert there are two `[data-booking-card]` elements, cancelling the first changes only that card to “已取消”, and clicking the second detail button navigates to its order-specific URL. Mount `BookingDetailView` at a known and an unknown order number and assert only the known route displays its court label.

- [ ] **Step 2: Run the component tests and verify RED**

Run: `npx vitest run tests/my-bookings.test.js`

Expected: FAIL because the page renders one record and the detail route has no order parameter.

- [ ] **Step 3: Implement list rendering and route selection**

Change the list state to `ref(getMockBookings())`, render cards with `v-for="booking in bookings"`, and pass `booking.orderNo` to cancellation and navigation handlers. Register `/my-bookings/detail/:orderNo`; read `useRoute().params.orderNo` in the detail page and call `getMockBooking(orderNo)`.

- [ ] **Step 4: Run the component tests and verify GREEN**

Run: `npx vitest run tests/my-bookings.test.js`

Expected: all tests in the file pass.

- [ ] **Step 5: Commit the multi-booking interface**

Run: `git add src/views/MyBookingsView.vue src/views/BookingDetailView.vue src/router/index.js tests/my-bookings.test.js && git commit -m "feat: manage multiple saved bookings"`

### Task 3: Documentation and full verification

**Files:**
- Modify: `README.md`
- Modify: `docs/页面说明.md`
- Modify: `docs/技术说明.md`

**Interfaces:**
- Documents the final browser-only collection behavior and legacy migration.

- [ ] **Step 1: Update user and technical documentation**

State that multiple bookings persist in the same browser through `localStorage`, cancellation retains records, and no clear/delete action exists. Remove statements that say data uses `sessionStorage` or disappears when the tab closes.

- [ ] **Step 2: Run full verification**

Run: `npm test && npm run build && git diff --check`

Expected: Node and Vitest suites pass, Vite builds successfully, and Git reports no whitespace errors.

- [ ] **Step 3: Review the six requirements**

Confirm the implementation appends, lists, selects, and cancels by order number; retains cancelled records; exposes no clear/delete UI; and performs no network request.

- [ ] **Step 4: Commit the documentation**

Run: `git add README.md docs/页面说明.md docs/技术说明.md && git commit -m "docs: explain persistent booking history"`
