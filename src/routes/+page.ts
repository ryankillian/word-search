import type { PageLoad } from './$types';

import { bible } from '$lib/data/kjb';

export const load = (async () => {
	return {
		bible
	};
}) satisfies PageLoad;
