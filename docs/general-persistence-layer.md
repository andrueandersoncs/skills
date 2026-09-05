# General persistence layer

## Intent

Build a reusable persistence layer for data structures in Effect. A persistent map, set, or queue should share storage machinery rather than each implementing persistence independently.

The starting question was whether Effect’s `PersistedQueue` points to a more general abstraction. The desired generalization is the storage layer underneath data-structure operations. It is not a promise that every existing in-memory structure can become durable without changing its implementation or semantics.

This is a concept document for understanding and developing that idea, not an implementation specification. Names below are illustrative. No backend or exact API has been selected.

## What “automatic persistence” means

Applications use a data structure’s operations. Those operations perform the necessary storage changes without a separate application-level `save()` call.

For example:

- Setting a persistent map entry stores the association.
- Adding a persistent set member stores its membership.
- Offering a persistent queue item stores the item for later consumption.

A successful mutation should mean its storage operation has succeeded, subject to the configured backend’s durability guarantees. Reopening the same named structure against the same durable backend should expose its persisted state.

This does not mean persisting arbitrary JavaScript objects, observing all mutations to them, or checkpointing running Effects and fibers. The abstraction persists encoded values and the metadata needed by supported operations.

## Proposed separation

```text
Application
  ├─ PersistentMap: get / set / delete
  ├─ PersistentSet: add / remove / has
  └─ PersistentQueue: offer / claim / acknowledge / retry
                    │
         Shared persistence layer
         encoding, storage access,
         atomic updates / transactions
                    │
             Storage backend
```

The shared layer should own the common machinery:

- Encoding and decoding stored values using schemas.
- Addressing stored data by structure identity and entry identity.
- Reading and writing through a backend service.
- Providing atomicity for operations that must update related state together.

Each data structure should own the meaning of its operations and the arrangement of its persisted state. A backend supplies the storage mechanisms that those operations require.

The boundary should follow demonstrated common needs. It should not force every backend into an interface too weak to implement the structures correctly, or move queue-specific behavior into every other structure.

## Why a queue still needs its own protocol

Persistence answers where state survives. A durable work queue must also answer who owns an item and when processing is complete.

Deleting an item as soon as a worker takes it can lose unfinished work if the worker crashes. Keeping it until processing succeeds requires a claim, acknowledgement, and a way to recover abandoned claims.

A durable work queue therefore needs structure-specific behavior:

- Claim work atomically.
- Track ownership with a lease.
- Acknowledge successful processing.
- Release or retry failed work.
- Recover work after an expired lease.

Effect’s `take(handler)` gives the queue a processing window. The handler’s exit determines whether the queue acknowledges or retries the item. That lifecycle is separate from the underlying persistence mechanism.

The general layer should make the necessary storage transitions possible. It should not impose leases, retries, or processing handlers on a map or set.

Persistence also does not make external side effects exactly once. A worker can perform a side effect and crash before acknowledgement; another worker may then process the same item.

## Relationship to Effect’s implementation

The inspected Effect v4 implementation separates `PersistedQueueFactory` from `PersistedQueueStore`:

- The factory adds schema encoding/decoding and ID generation.
- The store provides `offer` and scoped `take` operations.
- SQL, Redis, and memory implementations supply the storage and processing protocol.
- Scoped finalizers acknowledge or retry processing. Expiring leases in the durable backends allow recovery when the process cannot run its finalizers.

The proposed design moves reusable persistence concerns below data-structure-specific services. It does not merely rename `PersistedQueueStore`: that service already contains queue semantics.

Source: [`PersistedQueue.ts`, Effect v4, revision `884905232d1e9a365e046d8dde27bf9c5707f57f`](https://github.com/Effect-TS/effect-smol/blob/884905232d1e9a365e046d8dde27bf9c5707f57f/packages/effect/src/unstable/persistence/PersistedQueue.ts).

## What would demonstrate the idea

A useful proof would implement more than one data structure over the same persistence service. A map and a durable work queue would exercise both simple state mutations and multi-step processing transitions.

The proof should show that:

- Applications mutate both structures without separate save calls.
- Stored state survives process restart on the durable backend.
- Encoding and storage primitives are reused rather than copied into each structure.
- Queue claims and acknowledgements remain queue-specific.
- Abandoned work becomes available again after its lease expires.

Whole-structure snapshots could demonstrate simple persistence, but they would not by themselves demonstrate reusable atomic operations or safe coordination between workers. Snapshotting is not the selected design here.

## Conversation record

The following excerpts are verbatim. They preserve the progression from understanding Effect’s queue to wanting a general persistence layer; the proposal above is a synthesis, not a verbatim specification supplied by the user.

**User:**

> how does Effect's PersistedQueue achieve automatic persistence? what is the actual implementation like?

**Assistant:**

> **`PersistedQueue` writes each offered item to a backing store, then uses scoped finalizers to acknowledge or retry processing.** It persists the data and processing metadata, not the running Effect or fiber.

**User:**

> interesting.. so there is a "Store" service, essentially?

**Assistant:**

> `PersistedQueueFactory` captures the store and adds schema encoding/decoding and ID generation. SQL, Redis, and memory are interchangeable implementations of that service.

**User:**

> ah okay, interesting. so essentially it re-implements some of Queue's interface but adds persistence in

**Assistant:**

> The important difference is **`take(handler)` rather than `take → item`**. It owns the processing window so it can automatically acknowledge success or requeue failure. That makes it a durable work queue, rather than a persistent drop-in replacement for `Queue`.

**User:**

> oh interesting, does that mean there's a more general solution that could have been implemented that would have worked for other data structures?

**Assistant:**

> Yes. **A general persistence layer could support multiple data structures**, with structure-specific operations built above it:

```text
Persistent storage: transactions, reads, writes
  ├─ PersistentMap: get / set / delete
  ├─ PersistentSet: add / remove / has
  └─ PersistentQueue: offer / claim / acknowledge / retry
```

**Assistant, same response:**

> Serialization, storage access, and transactions could be shared. But **the meaning of each operation still belongs to the data structure**.

> So yes: **persistence could be generalized underneath this implementation; reliable work delivery would still require queue-specific logic.** `take(handler)` provides the processing lifecycle, not persistence itself.

**User:**

> perfect. write this out as a concept document describing what I want to build with the general persistence layer idea. Be sure to quote our conversation history here so you don't lose the intent. write it to docs/
