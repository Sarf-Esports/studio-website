<script lang="ts">
  import type { Track } from "../../types/music";

  interface Props {
    currentTrack: Track | null;
    isMobile: boolean;
  }
  const { currentTrack, isMobile }: Props = $props();
</script>

<div class="track-info {isMobile ? 'mobile' : 'desktop'}">
  <div class="track-title">{currentTrack?.title ?? "-"}</div>
  <div class="track-artist">{currentTrack?.artist ?? "-"}</div>
</div>

<style lang="scss">
  .track-info {
    text-align: center;

    .track-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #f6e9e9;
    }

    .track-artist {
      font-size: 14px;
      color: rgba(246, 233, 233, 0.7);
    }

    &.mobile {
      text-align: left;
      flex: 1;
      min-width: 0;

      .track-title {
        font-size: 14px;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &.desktop {
      margin-bottom: 16px;
    }
  }
</style>
