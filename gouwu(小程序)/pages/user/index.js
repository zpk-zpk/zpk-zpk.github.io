// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    // 被收藏的商品数量
    collectNums:0
  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const userinfo=wx.getStorageSync("userInfo")
    const collect=wx.getStorageSync("collect")||[]
    this.setData({userinfo,collectNums:collect.length})
      
  },

 
})