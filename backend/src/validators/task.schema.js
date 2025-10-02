import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional()
});

export const updateTaskSchema = createTaskSchema.partial();
