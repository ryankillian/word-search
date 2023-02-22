import { z } from 'zod';

export const contactSchema = z.object({
	username: z
		.string({ required_error: 'Name is required' })
		.min(1, { message: 'Name must be more than 1 character' })
		.max(64, { message: 'Name must be less than 64 characters' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.min(6, { message: 'Email is required' })
		.max(64, { message: 'Email must be less than 64 characters' })
		.email({ message: 'Email must be a valid email address' }),
	message: z
		.string({ required_error: 'Message is required' })
		.min(1, { message: 'Message must be more than 1 character' })
		.max(512, { message: 'Message must be less than 512 characters' })
		.trim()
});
