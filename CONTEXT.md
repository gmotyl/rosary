# Rosary

A personal, offline-first PWA that tracks where the user is in praying the Holy Rosary. Single-device, no backend, no auth — all state lives in the browser's localStorage.

## Language

**Intention**:
A personal prayer goal — a person, situation, or thanksgiving — with its own decade progress and lifetime rosary count.
_Avoid_: petition, request, prayer.
_Note_: prior versions also used "Intention" to mean a community-shared petition with a `userId`. That meaning is gone after cut C.

**Mystery**:
One of the 20 canonical events of the rosary, grouped into Joyful (1–5), Luminous (1–5), Sorrowful (1–5), Glorious (1–5).
_Avoid_: meditation, station.

**Decade**:
One mystery's worth of prayer — typically the Our Father + 10 Hail Marys + Glory Be that accompany meditation on a single Mystery.
_Avoid_: round, set.

**Rosary** (the activity):
A full cycle of all 20 Mysteries prayed in sequence; the unit counted by `completedRosaries`.
_Avoid_: cycle, prayer.

**Rosary** (the app):
The PWA itself. Display name is "ROSARY" (`src/components/Header/Header.tsx`).

## Relationships

- An **Intention** has exactly one current **Mystery** (`currentMystery`) — the next one to pray.
- An **Intention** accumulates **Rosaries** as the user advances through Mysteries 1 → 20 → 1; each wrap-around increments `completedRosaries`.
- A **Rosary** is composed of 20 **Mysteries**, prayed one **Decade** at a time.
- The set of **Mysteries** is fixed (a constant); user data attaches to **Intentions**, not to **Mysteries**.

## Example dialogue

> **Dev:** "When a user finishes the Glorious 5 Mystery, do we count a **Rosary** completed?"
> **Domain:** "Yes — the moment the user taps Next from Glorious 5, the **Intention**'s `currentMystery` cycles back to Joyful 1, and that's when `completedRosaries` increments. There's no separate event."

> **Dev:** "Can two **Intentions** share progress?"
> **Domain:** "No. Each **Intention** has its own `currentMystery` and `completedRosaries`. If a user prays for Mum on Joyful 3 and Dad on Sorrowful 2, those are two separate states."

## Flagged ambiguities

- **Intention** previously meant *both* "personal prayer goal" *and* "community petition someone published for others to pray for" — these were the same shape on the client but joined to `users` and `pray_rosary_requests` on the server. Resolved by removing the community side: only the personal meaning remains.
- **Rosary** is overloaded between *the activity* (a 20-mystery prayer cycle) and *the app*. Code should always say `completedRosaries` (count of prayer cycles) and reserve the bare word for the activity in user-facing copy.
