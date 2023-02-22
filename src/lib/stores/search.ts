import { writable } from 'svelte/store';

export interface Model<T extends Record<PropertyKey, any>> {
	data: T[];
	filtered: T[];
	search: string;
}

export const createStore = <T extends Record<PropertyKey, any>>(data: T[]) => {
	const { subscribe, set, update } = writable<Model<T>>({
		data: data,
		filtered: data,
		search: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const handler = <T extends Record<PropertyKey, any>>(store: Model<T>) => {
	const keywords = store.search.trim().toLowerCase().split(/\s+/);

	if (keywords.length === 0) {
		return [];
	}
	store.filtered = store.data.filter((item) => {
		for (let i = 0; i < keywords.length; i++) {
			if (!item.keywords.includes(keywords[i])) {
				return false;
			}
		}
		return true;
	});
};
