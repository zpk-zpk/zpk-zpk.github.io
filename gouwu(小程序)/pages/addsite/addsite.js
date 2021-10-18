// pages/addAddress/addAddress.js
  
Page({
  /**
   * 页面的初始数据
   */

  data: {
      type:['默认','家','学校','公司'],//标签类型
      typeNum:5,//标签类型
      name:'',//姓名
      phone:'',//电话
      address:'',//地址
      detailAddress:'',//详细地址
      timer:null,//延时器标识
      timer1:null,//延时器标识
      timer2:null,//延时器标识
      timer3:null,//延时器标识
      warnflag:false,//警告提示
      tipsFlag:false,//正确提示
      tipscontent:'',//提示内容
      id:null,//编辑的地址id
  },
  // 获取姓名
  getName(e){
      clearTimeout(this.data.timer);
      this.data.timer = setTimeout(()=>{
          this.setData({
              name:e.detail.value
          })
      },500)
  },
   // 获取电话
   getPhone(e){
      clearTimeout(this.data.timer1);
      this.data.timer1 = setTimeout(()=>{
          this.setData({
              phone:e.detail.value
          })
      },500)
  },
   // 获取地址
   getAddress(e){
      clearTimeout(this.data.timer2);
      this.data.timer2 = setTimeout(()=>{
          this.setData({
              address:e.detail.value
          })
      },500)
  },
  // 获取详细地址
       getDetailAddress(e){
          clearTimeout(this.data.timer3);
          this.data.timer3 = setTimeout(()=>{
              this.setData({
                  detailAddress:e.detail.value
              })
          },500)
      },
  // 获取类型
  getType(data){
      this.setData({
          typeNum:data.currentTarget.dataset.index
      })
  },
  // 添加地址
  addAddress(){
      let name = this.data.name
      let phone = this.data.phone
      let address = this.data.address
      let detailAddress = this.data.detailAddress
      // 没有填完整
      if(name == '' || phone == '' || address == '' ||  detailAddress == ''){
          this.setData({
              warnFlag:true,
              tipscontent:'请补充完整收货地址'
          })
          setTimeout(()=>{
              this.setData({
                  warnFlag:false,
              })
          },1500)
      }else{//填完整
          let id = new Date().getTime();
          let addressList = {
              id,
              name:this.data.name,
              phone:this.data.phone,
              address:this.data.address,
              detailAddress:this.data.detailAddress,
              type:this.data.type[this.data.typeNum]
          }
          // 判断是否是默认地址
          if(this.data.type[this.data.typeNum] == '默认'){
              wx.setStorageSync('defaultAddress',addressList)
          }
          // 判断缓存中是否有地址
          let address =  wx.getStorageSync('addressLists')
          // 如果有记录
          if(address){
              // 判断是否有默认地址
             let index = address.findIndex(item=>item.type == this.data.type[this.data.typeNum])
             if(index != -1){//如果有
              address[index].type = '';
             }
              address.push(addressList)
              wx.setStorageSync('addressLists',address)
          }else{//没有记录
              wx.setStorageSync('addressLists', [addressList])
          }
          this.setData({
              typeNum:5,//标签类型
              name:'',//姓名
              phone:'',//电话
              address:'',//地址
              detailAddress:'',//详细地址
              tipsFlag:true,
              tipscontent:'成功保存地址'
          })
          setTimeout(()=>{
              this.setData({
                  tipsFlag:false,
              })
              wx.navigateBack({
                  delta: 1,
                })
          },1500)
        //   wx.navigateTo({
        //     url: '/pages/address/address',
        //   })
      }
  },
  // 删除地址
  del(){
      let addressLists = wx.getStorageSync('addressLists')
      let defaultAddress = wx.getStorageSync('defaultAddress')
      let id = this.data.id
      let index = addressLists.findIndex(item=>item.id == id)
      addressLists.splice(index,1)
      wx.setStorageSync('addressLists', addressLists)
      // 判断是否是默认地址
      if(id == defaultAddress.id){
          wx.setStorageSync('defaultAddress', '')
      }
      this.setData({
          typeNum:5,//标签类型
          name:'',//姓名
          phone:'',//电话
          address:'',//地址
          detailAddress:'',//详细地址
          tipsFlag:true,
          tipscontent:"删除成功",
          id:null,   
      })
      setTimeout(() => {
          this.setData({
              tipsFlag:false
          })
      }, 1500);
  },
  // 保存修改地址
  xiugai(){
      let addressLists = wx.getStorageSync('addressLists')
      let id = this.data.id
      let index = addressLists.findIndex(item=>item.id == id)
      addressLists[index].name = this.data.name
      addressLists[index].phone = this.data.phone
      addressLists[index].address = this.data.address
      addressLists[index].detailAddress = this.data.detailAddress
      if(this.data.typeNum == 0){
          let i = addressLists.findIndex(item=>item.type == this.data.type[0])
          addressLists[i].type = '';
          addressLists[index].type = this.data.type[this.data.typeNum]
          let defaultAddress = {
              id,
              name:this.data.name,
              phone:this.data.phone,
              address:this.data.address,
              detailAddress:this.data.detailAddress,
              type:'默认'
          }
          wx.setStorageSync('defaultAddress', defaultAddress)

      }else{
          addressLists[index].type = this.data.type[this.data.typeNum]
      }

      wx.setStorageSync('addressLists', addressLists)
      this.setData({
          typeNum:5,//标签类型
          name:'',//姓名
          phone:'',//电话
          address:'',//地址
          detailAddress:'',//详细地址
          tipsFlag:true,
          tipscontent:"修改成功",
          id:null,   
      })
      setTimeout(() => {
          this.setData({
              tipsFlag:false
          })
      }, 1500);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let addressLists = wx.getStorageSync('addressLists')
      let id = options.id
      this.data.id = id
      if(addressLists){
          let index = addressLists.findIndex(item=>item.id == id)
          let typeNum = this.data.type.findIndex(item=>item == addressLists[index].type)
          this.setData({
              id:options.id,
              name:addressLists[index].name,
              phone:addressLists[index].phone,
              address:addressLists[index].address,
              detailAddress:addressLists[index].detailAddress,
              typeNum,
          })
      }
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