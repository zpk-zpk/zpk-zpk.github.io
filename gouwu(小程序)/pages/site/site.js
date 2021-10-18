// pages/address/address.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      addressLists:[
          {
              id:1,
              name:"xxx",
              phone:111111111,
              address:"广东省广州市天河区",
              detailAddress:"大路口",
              type:"默认",
              pages:null,
          },
      ]
  },
// 更改地址
// changeAddress(data){
//   if(this.data.pages == 'pages/pay/pay'){
//       let id = data.currentTarget.dataset.id
//       let addressLists = wx.getStorageSync('addressLists')
//       let index = addressLists.findIndex(item=>item.id == id)
//       wx.setStorageSync('defaultAddress', addressLists[index])
//       wx.navigateBack({
//         delta: 1,
//       })
//   }
// },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let  addressLists = wx.getStorageSync('addressLists')
      let pages = getCurrentPages()//路由地址
      let prve = pages[pages.length - 2]//路由地址
      this.setData({
          addressLists,
          pages:prve.route
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
      let  addressLists = wx.getStorageSync('addressLists')
      this.setData({
          addressLists
      })
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