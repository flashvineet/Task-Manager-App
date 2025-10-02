import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  bio: z.string().max(300).optional(),
  avatarUrl: z.string().url().optional()
});
