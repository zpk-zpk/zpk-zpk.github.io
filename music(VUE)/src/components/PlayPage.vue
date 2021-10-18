<template>
  <section class="play-page">
    <div
      class="mask"
      :style="{
        backgroundImage: `url(${
          currentSong.song ? currentSong.picUrl : currentSong.al.picUrl
        }?imageView=1&type=webp&thumbnail=246x0)`,
      }"
    ></div>
    <button @click="$emit('toggle-show-play-page', false)">play-page</button>

    <section class="rotate" @click="showLyric = true" v-if="!showLyric">
      <img
        class="needle"
        :class="{ paused: !playing }"
        src="https://s3.music.126.net/mobile-new/img/needle-ab.png"
        alt=""
      />
      <section class="record" :class="{ playing: playing }">
        <img
          class="thumb"
          :src="currentSong.song ? currentSong.picUrl : currentSong.al.picUrl"
          alt=""
        />
        <img
          class="disc"
          src="https://s3.music.126.net/mobile-new/img/disc.png"
          alt=""
        />
      </section>
    </section>
    <section class="lyric" v-else @click="showLyric = false" ref="lyric">
      <ul
        class="content"
        ref="lyricContent"
        v-if="parsedLyric.length"
        :style="{ marginTop: -scrollH + 'px' }"
      >
        <li v-for="(l, i) in parsedLyric" :key="i">
          <span
            :style="{
              animationDuration: parsedLyric[i + 1]
                ? parsedLyric[i + 1].time - l.time - 0.5 + 's'
                : '3s',
            }"
            :class="{
              active: currentLyricIndex === i,
              playing: playing && currentLyricIndex === i,
            }"
            >{{ l.text }}</span
          >
        </li>
      </ul>
    </section>

    <section class="progress">
      <input
        type="range"
        :max="duration"
        step="0.5"
        v-model="value"
        @change="progressChange"
        @input="progressInput"
      />
      <span
        class="bar"
        :style="{ width: (value / duration) * 100 + '%' }"
      ></span>
      <!-- <input type="range" :max="duration" step="0.5" v-model="value" /> -->
    </section>

    <section class="controls">
      <span @click="$emit('toggle-play-model')">模</span>
      <span @click="$emit('prev-song')">上</span>
      <span @click="$emit('toggle-playing-state')">播</span>
      <span @click="$emit('next-song')">下</span>
      <span @click.stop="$emit('toggle-show-play-list', true)">列</span>
    </section>
  </section>
</template>

<script>
export default {
  props: {
    currentSong: Object,
    playing: Boolean,
    duration: Number,
    currentTime: Number,
  },
  data: function() {
    return {
      value: this.currentTime,
      inputing: false,
      showLyric: false,
      lyric: null,
      lisH: [],
      scrollH: 0,
    };
  },
  watch: {
    currentTime: function(n) {
      if (!this.inputing) {
        this.value = n;
      }
    },

    "currentSong.id": function(id) {
      // console.log(id);
      this.getLyric(id);
    },

    currentLyricIndex: function(index) {
      // var lis = this.$refs.lyricContent
      //   ? this.$refs.lyricContent.querySelectorAll("li")
      //   : null;
      // console.log(index);
      // 当前歌词前面所有的歌词的高度
      var h = this.lisH.slice(0, index).reduce(function(total, item) {
        return total + item;
      }, 0);
      // console.log(h);
      h = h > 200 ? h - 200 : 0;
      h = h > 1928 ? 1928 : h;
      this.scrollH = h;
    },
    parsedLyric: function() {
      // console.log("parsedLyric改变", this.$refs.lyricContent);
      this.$nextTick(() => {
        // console.log("nextTick", this.$refs.lyricContent);
        var lis = this.$refs.lyricContent.querySelectorAll("li");
        this.lisH = [...lis].map((item) => item.offsetHeight);
      });
    },
  },
  created: function() {
    this.getLyric(this.currentSong.id);
    // console.log(this.$refs.lyricContent);
  },
  methods: {
    progressChange: function(event) {
      this.inputing = false;
      this.$emit("current-time-change", event.target.value);
    },
    progressInput: function() {
      this.inputing = true;
    },

    getLyric: function(id) {
      this.axios
        .get("/lyric", {
          params: { id, },
        })
        .then((res) => (this.lyric = res.data.lrc.lyric));
    },
  },
  computed: {
    parsedLyric: function() {
      if (this.lyric) {
        return this.lyric
          .split("\n")
          .filter((s) => s)
          .map((s) => {
            var text = s.replace(/^\[\d{2}:\d{2}\.\d{2,3}\]/i, "");
            var timeStr = s.replace(text, "").replace(/(^\[|\]$)/g, "");
            var timeArr = timeStr.split(":").map((item) => Number(item));
            var time = timeArr[0] * 60 + timeArr[1];
            return { text, time };
          });
      } else {
        return [];
      }
    },
    currentLyricIndex: function() {
      var i = this.parsedLyric.findIndex(
        (item) => item.time > this.currentTime
      );
      var currentLyricIndex = i !== -1 ? i - 1 : this.parsedLyric.length - 1;
      return currentLyricIndex;
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes xxx {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -100%;
  }
}
.pos-ab() {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.play-page {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;

  overflow: hidden;
  &::before {
    content: "";
    display: block;
    .pos-ab();
    z-index: -2;
    background-color: #333;
  }

  .mask {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(30px) brightness(0.8);
    .pos-ab();
    z-index: -1;
    transform: scale(1.5);
    transition: all 0.8s;
  }
  .rotate {
    position: relative;
    padding-top: 25vw;
    img.needle {
      height: 40vw;
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 9;
      margin-left: -15px;
      transform-origin: 15px 15px;
      transform: rotate(0deg);
      transition: all 0.3s;
      &.paused {
        transform: rotate(-20deg);
      }
    }
    .record {
      position: relative;
      width: 80vw;
      height: 80vw;
      margin: 0 auto 0 auto;
      img {
        .pos-ab();
        border-radius: 50%;
        &.thumb {
          transform: scale(0.8);
        }
      }
      animation: rotate 8s linear infinite;
      animation-play-state: paused;
      &.playing {
        animation-play-state: running;
      }
    }
  }

  .lyric {
    height: 60vh;
    color: white;
    text-align: center;
    // background: lightblue;

    overflow: hidden;
    position: relative;
    ul {
      transition: all 0.3s;
      li {
        line-height: 1.8;
        // font-size: 24px;
        span {
          &.active {
            animation-name: xxx;
            animation-timing-function: linear;
            animation-duration: 3s;
            background-image: linear-gradient(
              to right,
              rgb(238, 20, 111) 50%,
              rgb(28, 96, 255) 50%
            );
            background-size: 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            // text-shadow: 0 0 1px rgb(246, 203, 12);

            animation-play-state: paused;
            &.playing {
              animation-play-state: running;
            }
          }
        }
      }
    }
  }
  .progress {
    width: 80vw;
    height: 4px;
    margin: 20px auto;
    background: white;
    position: relative;
    border-radius: 10px;

    input {
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      z-index: 1;
      top: 0;
    }
    .bar {
      .pos-ab();
      background: lightcoral;
      border-radius: inherit;
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        display: block;
        margin-right: -5px;
        background: red;
        position: absolute;
        top: -3px;
        right: 0;
        border-radius: 50%;
      }
    }
  }

  .controls {
    padding: 20%;
    display: flex;
    justify-content: space-around;
    color: white;
  }
}
</style>
