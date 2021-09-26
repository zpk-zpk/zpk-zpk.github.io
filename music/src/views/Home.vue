<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <HomeTitle>编辑推荐</HomeTitle>
    <ul class="home-cardlist">
      <!-- <CardListItem
        class="xxx"
        v-for="item in personalizeds"
        :key="item.id"
        @click.native="$router.push('/playlist?id=' + item.id)"
      /> -->
      <CardListItem v-for="item in personalizeds" :key="item.id" :item="item" />
    </ul>
    <!-- <ul>
      <li
        v-for="item in personalizeds"
        :key="item.id"
        @click="$router.push('/playlist?id=' + item.id)"
      >
        {{ item.name }}
      </li>
    </ul> -->

    <HomeTitle>最新音乐</HomeTitle>
    <ul class="home-songlist">
      <SongListItem
        v-for="item in newsongs"
        :key="item.id"
        :item="item"
        @change-current-song="
          $emit('change-current-song', $event);
          $emit('change-current-play-list', newsongs);
        "
        :currentSongId="currentSongId"
        :playing="playing"
      ></SongListItem>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeTitle from "@/components/HomeTitle.vue";
import CardListItem from "@/components/CardListItem.vue";
import SongListItem from "@/components/SongListItem.vue";

export default {
  name: "Home",
  components: {
    HomeTitle,
    CardListItem,
    SongListItem,
  },
  props: {
    currentSongId: {
      type: Number,
    },
    playing: Boolean,
  },
  data: function() {
    return {
      personalizeds: [],
      newsongs: [],
    };
  },
  created: function() {
    // 发起ajax 是因为 这里最早可以 访问this
    this.axios
      .get("/personalized?limit=6")
      .then((res) => {
        // console.log(this, res);
        this.personalizeds = res.data.result;
      });

    this.axios
      .get("/personalized/newsong")
      .then((res) => {
        // console.log(this, res);
        this.newsongs = res.data.result;
      });
  },
};
</script>

<style lang="less">
.home-cardlist {
  display: flex;
  flex-wrap: wrap;
}
</style>
