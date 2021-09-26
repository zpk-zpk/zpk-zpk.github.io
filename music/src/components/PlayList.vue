<template>
  <section class="play-list">
    <div
      class="mask animate__animated animate__fadeIn"
      @click.stop="$emit('toggle-show-play-list', false)"
    ></div>

    <div class="swiper animate__animated animate__slideInUp">
      <div class="card">
        <ul class="list">
          <SongListItem
            v-for="(item, index) in currentPlayList"
            :key="item.id"
            :item="item"
            :currentSongId="currentSong.id"
            :playing="playing"
            @change-current-song="$emit('change-current-song', $event)"
            >{{ (index + 1).toString().padStart(2, "0") }}</SongListItem
          >
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import SongListItem from "@/components/SongListItem.vue";
export default {
  components: {
    SongListItem,
  },
  props: {
    showPlayList: Boolean,
    currentPlayList: Array,
    currentSong: Object,
    playing: Boolean,
  },
};
</script>

<style lang="less" scoped>
.play-list {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
  }
  .swiper {
    width: 100vw;
    height: 60vh;
    // background: rgba(255, 0, 0, 0.25);
    position: absolute;
    left: 0;
    bottom: 10px;

    padding: 0 10px;
    .card {
      // background: rgba(255, 0, 0, 0.25);
      background-color: white;
      height: 100%;
      border-radius: 15px;
      padding: 15px 0;
      ul.list {
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
