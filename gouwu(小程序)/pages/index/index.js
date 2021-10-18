//引入用来发送请求的方法
import {request} from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    floorList:[]
    
  },
  //options(Object)
  onLoad: function(options) {
 
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //         swiperList:result.data.message   
    //     })
    //   }
    // });

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
     
  },

  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result => {
      this.setData({
        swiperList:result   
      })
    }) 
  },

  // 获取 分类导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(result => {
      this.setData({
        catesList:result   
      })
    }) 
  },
  // getFloorList(){
  //   request({url:"/home/floordata"})
  //   .then(result => {
  //     this.setData({
  //       floorList:result   
  //     })
  //     console.log(result);
  //   }) 
  // },

getFloorList(){
  request({url:"/home/floordata"})
  .then(result=>{
    result.forEach(v1=>{
      v1.product_list.forEach(v2=>{
        v2.navigator_url=v2.navigator_url.replace(/\?/,"/index\?");
        // console.log(v2.navigator_url);
      });
    });
    this.setData({
      floorList:result
    })
  })
},


  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  