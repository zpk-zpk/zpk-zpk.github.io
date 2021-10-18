// pages/goos_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品是否被收藏过
    isCollect:false
  },
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

},
// 点击轮播图放大预览
handlePrevewImage(e){
  // 先构造要预览的图片数组
  const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
  // 接收传递过来的图片url
     const current=e.currentTarget.dataset.url;
  wx.previewImage({
 
    current,
    urls

  });
    
},
// 点击加入购物车
handleCartAdd(){
  // 获取缓存中的购物车 数组
  let cart=wx.getStorageSync("cart")||[];
  // 判断 商品对象是否存在购物车数组中
  let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
  if(index===-1){
    // 不存在 第一次添加
    this.GoodsInfo.num=1;
    this.GoodsInfo.checked=true;
    cart.push(this.GoodsInfo);
    console.log(cart);
  }else{
    // 已经存在购物车数据 执行num++
    cart[index].num++;
  }
  wx.setStorageSync("cart", cart);
    
  wx.showToast({
    title: '加入成功',
    icon: 'success',
    // 防止用户手抖多次点击
    mask: true,
   
  });
    

},
  // 点击 商品收藏图标
  handleCollect(){
    let isCollect=false;
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 判断该商品是否被收藏过
let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 当index！=-1表示已经收藏过了
    if(index!==-1){
      // 能找到，已经收藏过了，在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
        
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 把数组存入到缓存中
    wx.setStorageSync("collect",collect);
      // 修改data中的属性 isCollect
    this.setData({
      isCollect
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
    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);

    
      
      },
    // 获取商品详情数据
    async getGoodsDetail(goods_id){
      const goodsObj=await request({url:"/goods/detail",data:{goods_id}})
      this.GoodsInfo=goodsObj;
          // 获取缓存中的商品收藏的数组
    let collect=wx.getStorageSync("collect")||[];
    // 判断商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
      this.setData({
        goodsObj:{
          goods_name:goodsObj.goods_name, 
          goods_price:goodsObj.goods_price,
          // ipone部分手机 不识别webp图片格式
          // 最好找到后台工程师让他去改
          // 临时自己改，确保后台存在1.webp =>1.jpg
          goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics:goodsObj.pics
        },
        isCollect
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