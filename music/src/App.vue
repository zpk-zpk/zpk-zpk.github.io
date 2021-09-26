<template>
  <div id="app">
    <ul id="nav" v-if="$route.meta.showNavBar">
      <li>
        <router-link to="/">推荐音乐</router-link>
      </li>
      <li>
        <router-link to="/hot">热歌榜</router-link>
      </li>
      <li>
        <router-link to="/search">搜索</router-link>
      </li>
    </ul>
    <section class="routes">
      <transition
        name="custom-classes-transition"
        enter-active-class="animate__animated animate__slideInRight"
        leave-active-class="animate__animated animate__slideOutLeft"
      >
        <keep-alive>
          <router-view
            @change-current-song="changeCurrentSong"
            @change-current-play-list="changeCurrentPlayList"
            :currentSongId="currentSong ? currentSong.id : null"
            :playing="playing"
            style="position: absolute; top:0; left:0; width:100%;height:100%; overflow-y: auto;"
          />
        </keep-alive>
      </transition>
    </section>
    <audio
      ref="audio"
      :src="currentSongUrl"
      controls
      style="height:40px; margin-bottom: 40px"
      autoplay
      @playing="playing = true"
      @pause="playing = false"
      @timeupdate="timeupdate"
      @durationchange="durationchange"
    ></audio>
    <Play
      v-if="currentSong"
      :currentSong="currentSong"
      :playing="playing"
      @toggle-playing-state="togglePlayingState"
      :currentTime="currentTime"
      :duration="duration"
      :currentPlayList="currentPlayList"
      @change-current-song="changeCurrentSong"
      @next-song="nextSong"
      @prev-song="prevSong"
      @current-time-change="$refs.audio.currentTime = $event"
    ></Play>
  </div>
</template>

<script>
import Play from "./components/Play.vue";
export default {
  components: {
    Play,
  },
  data: function() {
    return {
      currentSong: null,
      currentPlayList: [],
      playing: false,
      currentTime: 0,
      duration: 0,
    };
  },
  computed: {
    currentSongUrl: function() {
      if (this.currentSong) {
        return `https://music.163.com/song/media/outer/url?id=${this.currentSong.id}.mp3`;
      } else {
        return null;
      }
    },
  },
  methods: {
    changeCurrentSong: function(song) {
      // console.log(song);
      this.currentSong = song;
    },
    changeCurrentPlayList: function(list) {
      this.currentPlayList = list;
    },
    togglePlayingState: function() {
      if (this.playing) {
        // 暂停歌曲
        this.$refs.audio.pause();
      } else {
        // 播放歌曲
        this.$refs.audio.play();
      }
    },
    timeupdate: function(event) {
      this.currentTime = event.target.currentTime;
    },
    durationchange: function(event) {
      this.duration = event.target.duration;
    },
    nextSong: function() {
      console.log(123);
      var index = this.currentPlayList.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      index++;
      index = index >= this.currentPlayList.length - 1 ? 0 : index;
      index = index <= 0 ? this.currentPlayList.length - 1 : index;
      // console.log(index);
      this.changeCurrentSong(this.currentPlayList[index]);
    },
    prevSong: function() {
      console.log(456);
      var index = this.currentPlayList.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      index--;
      index = index >= this.currentPlayList.length - 1 ? 0 : index;
      index = index <= 0 ? this.currentPlayList.length - 1 : index;
      // console.log(index);
      this.changeCurrentSong(this.currentPlayList[index]);
    },
  },
};
</script>

<style lang="less">
.animate__animated {
  animation-duration: 0.3s;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  // padding: 30px;
  display: flex;
  // height: 50px;
  // border-bottom: 1px solid blue;
  box-shadow: 0 -1px 3px 0px rgb(231, 231, 231) inset;

  li {
    flex: 1;
    text-align: center;

    // background-color: lightblue;
    a {
      // font-weight: bold;
      color: #2c3e50;
      line-height: 40px;
      display: inline-block;
      text-decoration: none;
      font-size: 15px;
      padding: 0 5px;

      &.router-link-exact-active {
        color: #d43c33;
        border-bottom: 2px solid #d43c33;
      }
    }
  }
}
.routes {
  position: relative;
  top: 0;
  left: 0;
  height: calc(100vh - 42px);
  overflow: hidden;
}

// xxx.apk => xxx.zip =>解压
</style>
