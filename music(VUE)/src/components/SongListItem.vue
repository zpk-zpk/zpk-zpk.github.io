<template>
  <li
    v-if="item.song"
    class="songlistitem"
    @click="$emit('change-current-song', item)"
  >
    <div class="left">
      <div class="title">
        {{ item.name }}
        <span v-for="n in item.song.alias" :key="n">{{ n }}</span>
      </div>
      <div class="info">
        <em v-if="item.song.exclusive"></em>
        <i
          class="artist"
          v-for="artist in item.song.artists"
          :key="artist.id"
          >{{ artist.name }}</i
        >
        <b>{{ item.song.album.name }}</b>
      </div>
    </div>
    <div class="icon">
      <div
        class="play"
        :class="{ current: currentSongId === item.id, playing: playing }"
      >
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  </li>
  <li v-else class="songlistitem" @click="$emit('change-current-song', item)">
    <div class="num"><slot></slot></div>
    <div class="left">
      <div class="title">
        {{ item.name }} <span v-for="n in item.alia" :key="n">{{ n }}</span>
      </div>
      <div class="info">
        <!-- <em v-if="item.song.exclusive"></em> -->
        <i class="artist" v-for="artist in item.ar" :key="artist.id">{{
          artist.name
        }}</i>

        <b>{{ item.al.name }}</b>
      </div>
    </div>
    <div class="icon">
      <div
        class="play"
        :class="{ current: currentSongId === item.id, playing: playing }"
      >
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    currentSongId: {
      type: Number,
    },
    playing: Boolean,
  },
};
</script>

<style lang="less">
.songlistitem {
  padding: 5px 12px 5px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(212, 212, 212, 0.4);
  margin-left: 12px;
  .num {
    padding: 0 12px 0 0px;
  }
  &.lt3 {
    .num {
      color: #d43c33;
    }
  }
  .left {
    flex: 1;
    .title {
      //   font-size: 14px;
      // white-space: nowrap;
      // width: 100%;
      // overflow: hidden;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        color: #888;
        &::before {
          content: "(";
        }
        &::after {
          content: ")";
        }
      }
    }
    .info {
      font-size: 10px;
      color: #888;
      line-height: 1.8;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      em {
        display: inline-block;
        width: 12px;
        height: 8px;
        background-image: url("https://s3.music.126.net/mobile-new/img/index_icon_2x.png");
        background-repeat: no-repeat;
        background-size: 166px auto;
        margin-right: 4px;
      }
      i.artist {
        font-style: normal;
        &:after {
          content: "/";
          margin: 0 3px;
        }
        &:last-of-type {
          //   background: red;
          &::after {
            content: "-";
            margin: 0 5px;
          }
        }
      }
      b {
        font-weight: normal;
      }
    }
  }
  .icon {
    width: 22px;
    height: 22px;

    margin-left: 15px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .play {
      // position: absolute;
      // top: 0;
      // left: 0;
      width: 100%;
      height: 100%;
      // background: red;
      background-image: url("https://s3.music.126.net/mobile-new/img/index_icon_2x.png");
      background-repeat: no-repeat;
      background-size: 166px auto;
      background-position: -24px 0;
    }
    .current {
      width: 15px;
      height: 15px;
      background: red;
      background: none;
      display: flex;
      justify-content: space-around;
      // justify-content: space-between;
      i {
        width: 2px;
        height: 100%;
        // display: inline-block;
        background: #d43c33;
        transform-origin: bottom;
        animation: playing 0.8s linear 0s infinite alternate;
        animation-play-state: paused;
        &:nth-child(1) {
          animation-delay: -0.6s;
        }
        &:nth-child(2) {
          animation-delay: -0.4s;
        }
        &:nth-child(3) {
          animation-delay: -0.2s;
        }
      }
      &.playing {
        i {
          animation-play-state: running;
        }
      }
    }
  }
}

@keyframes playing {
  from {
    // height: 20%;
    transform: scaleY(0.2);
  }
  to {
    // height: 100%;
    transform: scaleY(1);
  }
}
</style>
