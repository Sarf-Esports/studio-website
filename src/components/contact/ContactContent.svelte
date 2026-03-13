<script lang="ts">
	import { onMount } from 'svelte';
	import { DISCORD_URL } from '../../utils';

	const MAIL_ADDRESS = 'contact.revati@gmail.com';

	type TabType = 'request' | 'apply';

	let category = $state<TabType>('request');

	function initializeTabFromURL() {
		if (typeof window === 'undefined') return;

		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab') as TabType;

		if (tabParam && ['request', 'apply'].includes(tabParam)) {
			category = tabParam;
		}
	}

	function updateURL(tabId: TabType) {
		if (typeof window === 'undefined') return;

		const url = new URL(window.location.href);
		url.searchParams.set('tab', tabId);
		window.history.replaceState({}, '', url.toString());
	}

	onMount(() => {
		initializeTabFromURL();
	});

	function handleTabChange(tabId: TabType) {
		category = tabId;
		updateURL(tabId);
	}
</script>

<div class="tab">
	<button onclick={() => handleTabChange('request')} class:is-active={category === 'request'}
		>ご依頼・ご相談</button
	><button onclick={() => handleTabChange('apply')} class:is-active={category === 'apply'}
		>クリエイター応募</button
	>
</div>

<hr />

<div class="content">
	{#if category === 'request'}
		<div>
			<h2>JOIN OUR COMMUNITY</h2>
			<p>ご依頼やご相談は、Discord サーバーにて受け付けております。</p>
			<a href={DISCORD_URL} class="btn" target="_blank" rel="noopener noreferrer">
				<!-- Discord's Symbol (Black): https://discord.com/branding -->
				<svg class="discord-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.644 96"
					><path
						d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"
					/></svg
				>
				Discord サーバーに参加
			</a>
			<p>
				Discordをご利用でない方は、<a href="mailto:{MAIL_ADDRESS}">{MAIL_ADDRESS}</a> にご連絡ください。
			</p>
		</div>
	{:else if category === 'apply'}
		<div>
			<h2>JOIN OUR TEAM</h2>
			<p>REVATI Studio では、共に新しい価値を創造してくれるクリエイターを随時募集しています。</p>
			<a
				href="https://docs.google.com/forms/d/e/1FAIpQLScA-hpI6RU3aE0WNUTaaSSac_zfAHsTCMNUdcTQzLwJd0HhOA/viewform"
				class="btn"
				target="_blank"
				rel="noopener noreferrer"
			>
				<!--
					Google Material Symbols and Icons - List Alt
					https://fonts.google.com/icons?selected=Material+Symbols+Outlined:list_alt:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=List+Alt&icon.size=24
					This icon is licensed under the Apache License Version 2.0: https://github.com/google/material-design-icons/blob/master/README.md
				-->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"
					><path
						d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
					/></svg
				>
				応募フォームに進む
			</a>
		</div>
	{/if}
</div>

<style lang="scss">
	.tab,
	.content {
		text-align: center;
	}

	button {
		font-family: inherit;
		font-size: 22px;
		font-weight: 900;
		color: inherit;
		padding: 14px 104px;
		background: none;
		border: none;
		cursor: pointer;
		transition: 0.1s;

		&:hover {
			background-color: rgba($color-accent, 0.1);
		}
	}

	.is-active {
		color: $color-primary;

		&,
		&:hover {
			background-color: $color-accent;
		}
	}

	hr {
		margin: 0 auto;
		width: calc(100% - 64px);
		border: none;
		border-top: 1px solid $color-accent;

		// タブのボタンの背景より狭くなってしまうため
		@media screen and (max-width: 824px) {
			width: 100%;
		}
	}

	h2 {
		font-size: 34px;
		margin-block: 24px;
		@include font-montserrat(800);
	}

	.btn {
		$color-accent-light: #f0b954;
		display: inline-block;
		font-size: 22px;
		font-weight: 900;
		color: $color-primary;
		margin-block: 42px;
		padding: 12px 40px;
		background: linear-gradient(
			90deg,
			$color-accent-light -50%,
			$color-accent 50%,
			$color-accent-light
		);
		background-size: 200% 100%;
		filter: drop-shadow(0 0 24px rgba($color-accent-light, 0.2));
		border-radius: 32px;
		text-decoration: none;
		transition: 0.3s;

		&:hover {
			background-position: 100% 0;
			filter: drop-shadow(0 0 32px rgba($color-accent-light, 0.3));
		}
	}

	svg {
		height: 33px;
		aspect-ratio: 1;
		vertical-align: bottom;
	}

	.discord-logo {
		margin-right: 8px;
	}

	@include sp {
		button {
			font-size: 19px;
			width: 50%;
			padding: 12px 0;
		}

		h2 {
			font-size: 25px;
		}

		p {
			font-size: 15px;
			margin-inline: 4px;
		}

		.btn {
			font-size: 19px;
			margin-block: 34px;
			padding: 14px 38px;
		}

		svg {
			height: 30px;
		}
	}
</style>
