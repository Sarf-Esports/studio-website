<script lang="ts">
	import { DISCORD_URL } from '../../utils/variables';

	const MAIL_ADDRESS = 'contact.revati@gmail.com';

	let category: 'request' | 'entry' = 'request';
</script>

<div class="tab">
	<button on:click={() => (category = 'request')} class:is-active={category === 'request'}
		>ご依頼・ご相談</button
	><button on:click={() => (category = 'entry')} class:is-active={category === 'entry'}
		>クリエイター応募</button
	>
</div>

<hr />

<div class="content">
	{#if category === 'request'}
		<div>
			<h2>JOIN OUR COMMUNITY</h2>
			<p>ご依頼やご相談は、Discord サーバーにて受け付けております。</p>
			<a href={DISCORD_URL} class="btn" target="_blank" rel="noopener noreferrer"
				>Discord サーバーに参加</a
			>
			<p>
				Discordをご利用でない方は、<a href="mailto:{MAIL_ADDRESS}">{MAIL_ADDRESS}</a> にご連絡ください。
			</p>
		</div>
	{:else if category === 'entry'}
		<div>
			<h2>JOIN OUR TEAM</h2>
			<p>REVATI Studio では、共に新しい価値を創造してくれるクリエイターを随時募集しています。</p>
			<a
				href="https://docs.google.com/forms/d/e/1FAIpQLScA-hpI6RU3aE0WNUTaaSSac_zfAHsTCMNUdcTQzLwJd0HhOA/viewform"
				class="btn"
				target="_blank"
				rel="noopener noreferrer">応募フォームに進む</a
			>
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
	}
</style>
