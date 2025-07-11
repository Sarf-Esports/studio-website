<script lang="ts">
  import type { Work } from '../../types';
  import { WORKS } from '../../data';
  import TabNavigation from './TabNavigation.svelte';
  import WorksList from './WorksList.svelte';
  import WorkModal from './WorkModal.svelte';

  type TabType = 'all' | keyof WORKS;

  let activeTab = $state<TabType>('all');
  let selectedWork = $state<Work | null>(null);

  // 全ての作品を取得
  function getAllWorks(): Work[] {
    return Object.values(WORKS).flat();
  }

  // 選択されたタブに応じて作品をフィルタリング
  const filteredWorks = $derived(
    activeTab === 'all' ? getAllWorks() : WORKS[activeTab] || []
  );

  function handleTabChange(tabId: TabType) {
    activeTab = tabId;
  }

  function handleWorkClick(work: Work) {
    selectedWork = work;
  }

  function handleCloseModal() {
    selectedWork = null;
  }
</script>

<div class="works-container">
  <TabNavigation {activeTab} onTabChange={handleTabChange} />

  <div class="works-content">
    <WorksList works={filteredWorks} onWorkClick={handleWorkClick} />
  </div>
</div>

<WorkModal work={selectedWork} onClose={handleCloseModal} />

<style lang="scss">
  .works-container {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 2rem 1rem;
    overflow: hidden;
    box-sizing: border-box;
  }

  .works-content {
    margin-top: 2rem;
    width: 100%;
    overflow: hidden;
  }

  // レスポンシブ対応
  @media (max-width: 768px) {
    .works-container {
      padding: 1.5rem 0.75rem;
      max-width: 100vw;
    }
  }

  @media (max-width: 480px) {
    .works-container {
      padding: 1rem 0.5rem;
      max-width: 100vw;
    }
  }
</style>
