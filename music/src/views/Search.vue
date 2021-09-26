<template>
  <div class="search" @scroll="scroll">
    <input
      type="text"
      placeholder="sousuo"
      v-model.trim="value"
      @keyup.enter="value && (searching = true)"
      @focus="inputing = true"
      @blur="inputing = false"
    />

    <section class="hots" v-if="!value && !searching">
      <h5>热门搜索</h5>
      <ul>
        <li
          v-for="hot in hots"
          :key="hot.first"
          @click="
            searching = true;
            value = hot.first;
          "
        >
          {{ hot.first }}
        </li>
        
      </ul>
      <ol>
          <li
            v-for="h in history"
            :key="h"
            @click="
              searching = true;
              value = h;
            "
          >
            {{ h }}
          </li>
        </ol>
    </section>

    <section class="suggests" v-if="value && !searching">
      <h5>搜索建议</h5>
      <ul>
        <li
          v-for="(item, index) in suggests"
          :key="index"
          @click="
            searching = true;
            value = item.keyword;
          "
        >
          {{ item.keyword }}
        </li>
      </ul>
    </section>

    <section class="suggests" v-if="searching">
      <h5>搜索结果</h5>
      <ul>
        <li v-for="(item, index) in searchResults" :key="index">
          {{ item.name }}
        </li>
      </ul>
      <p v-if="!hasMore">没有更多了</p>
    </section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      hots: [],
      suggests: [],
      searchResults: [],
      value: "",
      searching: false,
      inputing: false,
      page: 0,
      hasMore: false,
      history: JSON.parse(window.localStorage.getItem("history")) || [],
    };
  },
  methods: {
    scroll: function(event) {
      //   console.log(event);
      if (this.hasMore) {
        if (
          event.target.offsetHeight + event.target.scrollTop ===
          event.target.scrollHeight
        ) {
          console.log("触底");

          this.getSearch();
        }
      } else {
        console.log("没有更多了");
      }

      //   document.querySelector(".search").scrollHeight;
      //   document.querySelector(".search").scrollTop;
      //   document.querySelector(".search").offsetHeight;
    },
    getSearch: function() {
      this.axios
        .get("/search", {
          params: {
            keywords: this.value,
            limit: 30,
            offset: this.page * 30,
          },
        })
        .then((res) => {
          this.searchResults.push(...res.data.result.songs);
          this.page++;
          this.hasMore = res.data.result.hasMore;
        });

      // 记录一下
      // this.history.push(this.value)
      this.history = [...new Set([...this.history, this.value])];
      window.localStorage.setItem("history", JSON.stringify(this.history));
    },
  },
  created: function() {
    this.axios.get("/search/hot").then((res) => {
      this.hots = res.data.result.hots;
    });
  },
  watch: {
    value: function(n) {
      if (this.inputing) {
        this.searching = false;
      }
      if (n && !this.searching) {
        this.axios
          .get("/search/suggest", {
            params: {
              keywords: n,
              type: "mobile",
            },
          })
          .then((res) => {
            this.suggests = res.data.result.allMatch;
          });
      } else {
        this.suggests = [];
      }
    },

    searching: function(n) {
      if (n && this.value) {
        this.getSearch();
      } else {
        this.searchResults = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  padding: 10px;
  .hots {
    ul {
      overflow: hidden;
      li {
        float: left;
        border: 1px solid red;
        margin: 5px;
      }
    }
  }
}
</style>
