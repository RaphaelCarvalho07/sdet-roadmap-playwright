import { z } from "zod";
import {
  userSchema,
  apiUserResponseSchema,
  createUserPayloadSchema,
} from "../schemas/user.schema";

// Inferimos os tipos dinamicamente a partir dos Schemas do Zod 4
export type UserPayload = z.infer<typeof createUserPayloadSchema>;
export type IUser = z.infer<typeof userSchema>;
export type IApiUser = z.infer<typeof apiUserResponseSchema>;
