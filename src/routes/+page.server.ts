import { GOOGLE_FORM } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import type { z, ZodError } from 'zod';
import type { Actions } from './$types';

import { contactSchema } from './schema';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const { username, email, message } = contactSchema.parse(formData);

			try {
				let prefilled = `https://docs.google.com/forms/d/e/${GOOGLE_FORM}/formResponse?usp=pp_url&entry.2068873694=${username}&entry.841299125=${email}&entry.903645672=${message}&submit=Submit`;

				const res = await fetch(prefilled);
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			const { fieldErrors: errors } = (err as ZodError).flatten();
			const data = formData as {
				message: string;
				username: string;
				email: string;
			};
			return fail(400, {
				data,
				errors
			});
		}

		return {
			success: true
		};
	}
};
