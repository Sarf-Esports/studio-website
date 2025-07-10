<script lang="ts">
  interface Props {
    activeTab: string;
    onTabChange: (tab: string) => void;
  }

  let { activeTab, onTabChange }: Props = $props();

  const tabs = [
    { id: 'ALL', label: 'ALL' },
    { id: 'Movie', label: 'MOVIE' },
    { id: 'Music', label: 'MUSIC' },
    { id: 'Design', label: 'DESIGN' },
    { id: 'Service', label: 'SERVICE' }
  ];

  function handleTabClick(tabId: string) {
    onTabChange(tabId);
  }
</script>

<nav class="tab-navigation">
  <div class="tab-container">
    {#each tabs as tab}
      <button
        class="tab-button"
        class:is-active={activeTab === tab.id}
        onclick={() => handleTabClick(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  <hr />
</nav>

<style lang="scss">
  .tab-navigation {
    width: 100%;
    margin-bottom: 2rem;
    text-align: center;
  }

  .tab-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
  }

  .tab-button {
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    color: inherit;
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: relative;

    &:hover {
      background: rgba($color-accent, 0.1);
    }

    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px rgba($color-accent, 0.5);
    }
  }

  .is-active {
    color: $color-primary;

    &,
    &:hover {
      background: $color-accent;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: $color-accent;
    }
  }

  hr {
    margin: 0 auto;
    width: calc(100% - 2rem);
    border: none;
    border-top: 1px solid $color-accent;
  }

  // レスポンシブ対応
  @media (max-width: 768px) {
    .tab-container {
      gap: 0.5rem;
    }

    .tab-button {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      flex: none;
      min-width: calc(50% - 0.25rem);
    }

    hr {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .tab-button {
      min-width: 100%;
      padding: 0.875rem 1rem;
      font-size: 0.85rem;
    }
  }
</style>
