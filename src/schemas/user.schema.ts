import { z } from "zod";

/**
 * Validation contract for an individual User object (Zod 4 style)
 */
export const userSchema = z.object({
  id: z.number().positive(),
  email: z.email(), // Updated to top-level Zod 4 validator
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  avatar: z.url(), // Updated to top-level Zod 4 validator
});

/**
 * Validation contract for the paginated response of GET /api/users
 */
export const apiUserResponseSchema = z.object({
  page: z.number().positive(),
  per_page: z.number().positive(),
  total: z.number().positive(),
  total_pages: z.number().positive(),
  data: z.array(userSchema),
  support: z
    .object({
      url: z.url(), // Updated to top-level Zod 4 validator
      text: z.string().min(1),
    })
    .optional(), // Mapped as optional to prevent breaking if API contract changes
});

/**
 * Contract for the payload sent in POST /api/users
 */
export const createUserPayloadSchema = z.object({
  name: z.string().min(1),
  job: z.string().min(1),
});

/**
 * Contract for the success response of POST /api/users
 */
export const createUserResponseSchema = z.object({
  name: z.string().min(1),
  job: z.string().min(1),
  id: z.string().min(1),
  createdAt: z.iso.datetime(), // Validates ISO 8601 datetime format using Zod 4
});
