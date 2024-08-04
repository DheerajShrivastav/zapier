import { z } from 'zod'
export const SignupSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(8),
  name: z.string().min(3),
})
export const SigninSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(8),
})

export const ZapCreateSchema = z.object({
  availableTriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(z.object({
    availableActionId: z.string(),
    actionMetadata: z.any().optional()
  }))
})
