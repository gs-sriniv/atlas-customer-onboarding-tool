
## Integration Guide: Gainsight Atlas — Staircase: Email Sync Webhook Protocol

**Audience:** Staircase engineering  
**Version:** 1.0

---

### Overview

Gainsight AI Platform integrates with Staircase to process synced emails through agentic workflows. Staircase drives the sync lifecycle; the Gainsight platform is a passive responder at every step. Staircase is responsible for:

1. Initiating a sync session and discovering which email accounts to sync
2. Delivering email batches

---

### Base URL & Authentication

All endpoints are reachable at:

```
https://<gainsight-platform-host>/email/webhook/
```

Every request must carry two headers:

```
Authorization: GS-B2B-TOKEN <token>
x-cs-tenant-id: <tenant_id>
```

The `token` is a static shared secret provisioned per tenant. Requests with missing or invalid tokens are rejected with `401`.

---

### Sync Protocol

Staircase must follow this exact sequence per tenant sync:

```
POST /email/webhook/sync/start          ← once per sync session
  → returns list of accounts to sync

  for each account:
    POST /email/webhook/batch           ← one or more batches of emails
    POST /email/webhook/batch           ← ...
    POST /email/webhook/batch           ← ...

  (repeat for next account)
```

**Critical constraint:** Atlas considers an account fully synced if no new batch deliveries arrive within 10 minutes. Attachment downloads can be time-consuming, so they should be processed asynchronously to avoid blocking batch delivery. Alternatively, attachments can be retrieved on demand as Atlas requests them.

---

### Endpoint Reference

#### `POST /email/webhook/sync/start`

Called once at the start of a tenant sync session.

**Request:**
```json
{ "sync_id": "<staircase-generated-uuid>" }
```

**Response `200`:**
```json
{
  "accounts": [
    { "address": "alice@company.com", "type": "personal" },
    { "address": "bob@company.com",   "type": "personal" },
    { "address": "support@company.com", "type": "shared" }
  ]
}
```

The platform returns the list of email accounts configured for this tenant. Staircase should sync **only these accounts** in this session.
`sync_id` will be used mostly for debugging and logging purposes.

Each account object includes a `type` field:

| Value | Meaning |
|---|---|
| `personal` | A mailbox owned by a single user |
| `shared` | A shared mailbox accessed by multiple users (e.g. `support@company.com`) |

Staircase syncs both types identically. The `type` field is informational — Atlas uses it for relationship attribution and conversation ownership logic.

---

#### `POST /email/webhook/batch`

Delivers a batch of emails for a single account. Emails may arrive in any order (most-recent-first is expected). Staircase assigns a unique `batch_id` per call.

**Request:**
```json
{
  "sync_id": "...",
  "email_account": "alice@company.com",
  "batch_id": "batch-001",
  "emails": [
    {
      "message_id": "<msg@mail.example.com>",
      "thread_id": "...",   // optional
      "in_reply_to": "<parent@mail.example.com>",
      "references": ["<root@mail.example.com>", "<parent@mail.example.com>"],
      "subject": "Re: Renewal",
      "from_address": "alice@company.com",
      "sender_address": "support@company.com",  // optional; set when sent via a shared mailbox (RFC 5322 Sender header). Omit or null for personal accounts.
      "to_addresses": ["bob@company.com"],
      "cc_addresses": [],
      "received_at": "2026-04-03T10:00:00Z",
      "last_modified_at": "...",  // Generally same as received_at for new emails.  For updates, this will be noticeably later.
      "event_type": "new",
      "body_html": "<html>...</html>",
      "body_text": "...",
      "is_read": false,
      "is_flagged": false,
      "labels": ["Inbox"],   // this is exchange mail folder or google labels (not exchange categories)
      "is_archived": false,
      "is_trashed": false,
      "has_attachments": true,
      "attachments": [
        {
          "filename": "contract.pdf",
          "content_type": "application/pdf",
          "size_bytes": 102400,
          "disposition": "attachment"
        },
        {
          "filename": "logo.png",
          "content_type": "image/png",
          "size_bytes": 4096,
          "disposition": "inline",
          "content_id": "logo@company.com"
        }
      ]
    }
  ]
}
```

**Response `200`:**
```json
{ "status": "queued" }
```

The platform acknowledges receipt immediately and processes asynchronously. A `200` guarantees the batch has been durably enqueued — Staircase should not retry unless it receives a non-`200` response.

**Attachment handling:** When `has_attachments: true`, the platform will call back to Staircase's attachment API after storing the email:

```
GET {STAIRCASE_API_URL}/attachments
Authorization: GS-B2B-TOKEN <token>
Query params: tenant_id, email_account, message_id
```

Staircase must keep attachments accessible for some fixed period of time (e.g. 7 days).  The attachment retrieval approach outlined here is one option — we're open to whatever mechanism works best given Staircase's architecture.

---

### Shared Mailboxes

Shared mailboxes (e.g. `support@company.com`, `sales@company.com`) are synced identically to personal accounts. The differences are:

- `sync/start` returns them with `"type": "shared"`
- The `email_account` field in `/batch` is the shared mailbox address
- Emails sent *via* a shared mailbox must populate `sender_address` with the shared mailbox address and `from_address` with the delegating user's address (per RFC 5322 `Sender` vs `From` semantics). This distinction is important — Atlas uses it to attribute conversations to the correct individual while still associating them with the shared mailbox.

**Attachment retrieval for shared mailboxes** works the same as personal accounts — the `email_account` query param is the shared mailbox address.

**Open question for Staircase:** Does your connector preserve the RFC 5322 `Sender` header separately from `From`? Exchange's "Send As" and "Send on Behalf" modes surface this differently — confirm which scenarios you handle and whether `sender_address` will be reliably populated.

---

### Error Handling

| Status | Meaning |
|---|---|
| `200` | Request accepted; proceed |
| `401` | Invalid or missing B2B token |
| `400` | Malformed request body |
| `500` | Platform error — retry with exponential backoff |

On non-`200` responses to `/batch`, Staircase should retry the same batch (using the same `batch_id` for idempotency) before proceeding.

---

### Sync ID Scope

`sync_id` is Staircase-generated and must be:
- A unique UUID per sync session
- Consistent across all calls within that session (`sync/start`, all `/batch` calls)
- Not reused across sessions

---

### Summary of Staircase Responsibilities

| Responsibility | Notes |
|---|---|
| Generate unique `sync_id` per session | UUID, Staircase-owned |
| Respect account list from `sync/start` | Only sync returned accounts; includes shared mailboxes |
| Sync shared mailboxes identically to personal accounts | Use shared mailbox address as `email_account` |
| Populate `sender_address` for shared mailbox sends | Set to shared mailbox address; `from_address` is the delegating user |
| Keep attachments accessible for a fixed period of time | Atlas fetches them asynchronously post-batch |
| Retry `/batch` on non-`200` using same `batch_id` | Idempotency key |
| Populate `references` and `in_reply_to` per RFC 5322 | Drives thread grouping on the platform side |