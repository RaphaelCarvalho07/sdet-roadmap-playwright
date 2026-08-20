# 📘 Study Guide: API Contract Testing with Zod

This guide covers schema-based API contract testing to ensure backend response payloads comply with development contracts.

---

## 1. Manual Assertions vs. Schema Validation

Traditional API testing relies on individual assertions for specific fields:
```typescript
expect(response.status).toBe(200);
expect(body.id).toBeDefined();
expect(typeof body.email).toBe('string');
```
### The Problem:
This is verbose, hard to maintain, and fails to detect:
- Missing fields that are required.
- Unexpected fields (contract pollution).
- Incorrect string sub-formats (e.g. invalid email structures or malformed date strings).

---

## 2. Schema-Based Validation (Zod)

We define schemas that map the expected data contract structure and run validation dynamically:
- **Zod 4 format validation:** Enforces strings to be valid email formats, positive numbers, or non-empty strings.
- **Contract Enforcement:** Calling `.parse(responseBody)` will validate all payload properties instantly, throwing readable validation errors if the contract fails.

```
       JSON Response ──► [ Zod Schema .parse() ] ──► TypeScript Type
                                 │
                                 ▼ (If fails)
                        ContractValidationError
```

---

## 3. Schema Merging & Custom Refinements

- **DRY Schemas (Merging):** Instead of duplicating code for payloads and full database responses, we merge schemas using `.extend()` (e.g. extending a payload schema to include `id`, `createdAt`, and `updatedAt`).
- **Custom Refinements:** Standard validators (like `z.string().datetime()`) can fail if databases format dates with non-standard patterns (like SQLite using spaces instead of the `T` separator). We use `.refine()` with native `Date.parse()` to handle varied date representations safely:
  ```typescript
  export const dateStringSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });
  ```
- **Type Inference:** We use `z.infer<typeof schema>` to export TypeScript interfaces dynamically, maintaining the Zod schema as the single source of truth.
