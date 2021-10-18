// pages/category/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品左侧菜单数据
    leftMenuList:[],
    // 商品右侧菜单数据
    rightContent:[],
    // 被点击的左侧菜单
    currentIndex:0,
  //  右侧内容滚动条的scrollTop
  scrollTop:0
  },
    // 接口的返回数据
 Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

/*
    加载后先判断一下本地存储中有没有旧的数据
    我将本地存储是数据设置的格式：{time:Date.now(),data:[...]}
    没有旧数据就直接发送新请求
    有旧数据且旧数据还没过期，就使用本地存储中的旧数据
*/

// 获取本地存储中的数据
const Cates=wx.getStorageSync("cates");
  // 开始判断
  if(!Cates){
// 不存在 发送请求获取数据
this.getCates();
  }else{
    // 有旧数据 定义过期时间 10s 改成 5分钟
    if(Date.now()-Cates.time>1000*10){
      // 重新发送请求
      this.getCates();
    }else{
      // 可以使用旧的数据
      // console.log("可以使用旧的数据");
      this.Cates=Cates.data;
      // Cates已经有值了，可以进行渲染
  // 构造左侧数据
  let leftMenuList=this.Cates.map(v=>v.cat_name);
  // 构造右侧数据
  let rightContent=this.Cates[0].children;
  this.setData({
    leftMenuList,
    rightContent
  })
    }

  }




    // this.getCates();
  },

 async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res => {
    //   // console.log(res);
    //   this.Cates=res.data.message;

    //   // 把接口数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
        
      
    //   // 构造左侧数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   // 构造右侧数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

// 使用es7的async await来发送请求
const res=await request({url:"/categories"});

    // this.Cates=res.data.message;
    this.Cates=res;


      // 把接口数据存入到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
        
      
      // 构造左侧数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      // 构造右侧数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })

  },
  // 左侧菜单点击事件
  handleItemTap(e){
    // console.log(e);
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,  
      rightContent,
      // 重新设置右侧内容的scrollTop
      scrollTop:0
    })
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})