// pages/order/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      },
    ],
  },
  // 获取订单列表的方法
async getOrders(type){
  const res=await request({url:"/my/orders/all",data:{type}});
  console.log(res);
  this.setData({
    orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
     
  })

  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    // 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    // console.log(e);
    // 获取点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求 type=1 index=0
    this.getOrders(index+1);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
//  先判断是否有token
    const token=wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url:'/pages/auth/index'
        });
        return;
      }


    // 获取当前小程序的页面栈-数组 长度最大的是10页面
    let pages=  getCurrentPages();
    // console.log(pages);
    // 数组中，索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    // 获取url上的type参数
    const {type}=currentPage.options;
//  激活选中页面标题 当type=1 index=0；
this.changeTitleByIndex(type-1);
    this.getOrders(type);
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
    wx.reLaunch({
      url: '/pages/user/index',
    })
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