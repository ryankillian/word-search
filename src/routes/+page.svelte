<script lang="ts">
	import 'iconify-icon';
	import { Toaster, toast } from 'svelte-french-toast';
	import { copy } from 'svelte-copy';
	import { createStore, handler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	import type { ActionData } from './$types';
	import { enhance, type SubmitFunction } from '$app/forms';
	export let form: ActionData;

	import type { PageData } from './$types';
	export let data: PageData;

	interface Item {
		text: string;
		keywords: string[];
	}

	const lines: Item[] = data.bible.map((line) => ({
		text: line,
		keywords: line.toLowerCase().split(' ')
	}));

	const store = createStore(lines);

	const unsubscribe = store.subscribe((model) => handler(model));

	onDestroy(() => {
		unsubscribe();
	});

	let loading = false;

	const submitMessage: SubmitFunction = (input) => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			toggle = false;
			toast.success('Message received. Thanks!!');
			await update();
		};
	};

	const regex = /^(\w+\d+:\d+)\s(.*)$/;

	let toggle = false;

	const toggleContact = () => {
		toggle = !toggle;
	};
</script>

<Toaster />
<svelte:head>
	<title>Fast Word Search and Lookup for King James Bible</title>

	<meta
		name="description"
		content="Easily search and lookup words and verses in the King James Bible. Our tool provides fast and accurate results, making it easy to find what you're looking for."
	/>
	<meta
		name="keywords"
		content="King James Bible, word search, lookup, Bible search, Bible lookup"
	/>
</svelte:head>

<div class="app">
	<header>
		<h1>Bible Word Search</h1>
	</header>
	<main>
		{#if !toggle}
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="search"
				id="search"
				placeholder="search..."
				bind:value={$store.search}
				autofocus
			/>
			{#if $store.filtered.length != 0}
				<div class="results">Results: {$store.filtered.length}</div>
			{/if}
			{#if $store.filtered.length < 2600}
				<ul>
					{#each $store.filtered as line}
						{@const text = line.text.match(regex)}
						<li>
							<div class="list-item">
								<div class="list-item-header">
									<div>{text?.[1]}</div>
									<iconify-icon
										class="clipboard"
										use:copy={String(text?.[2])}
										icon="material-symbols:content-copy-outline"
									/>
								</div>
								<div>{text?.[2]}</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		{:else}
			<h2>Contact Form</h2>

			<form method="POST" use:enhance={submitMessage}>
				<label for="username">Name</label>
				<input
					type="text"
					id="username"
					name="username"
					value={form?.data?.username ?? ''}
					required
				/>
				{#if form?.errors?.username}
					<label for="name"><span class="error">{form?.errors.username[0]}</span></label>
				{/if}
				<label for="email">Email</label>
				<input type="email" id="email" name="email" value={form?.data?.email ?? ''} required />

				{#if form?.errors?.email}
					<label for="email"><span class="error">{form?.errors.email[0]}</span></label>
				{/if}

				<label for="message">Message</label>
				<textarea id="message" name="message" rows="3" value={form?.data?.message ?? ''} required />
				{#if form?.errors?.message}
					<label for="message"><span class="error">{form?.errors.message[0]}</span></label>
				{/if}

				<button disabled={loading}>Send Message</button>
			</form>
		{/if}
	</main>
	<footer><a href="/" on:click={() => toggleContact()}>contact page</a></footer>
</div>
