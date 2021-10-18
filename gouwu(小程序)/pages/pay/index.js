// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast, requestPayment} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
address:{},
cart:[],
totalPrice:0,
totalNum:0
  },

  onShow(){
    // 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    // 获取缓存中的购物车数据
let cart=wx.getStorageSync("cart")||[];
// 过滤后的计算机数组
cart=cart.filter(v=>v.checked);
  // 计算全选
  // const allChecked=cart.length?cart.every(v=>v.checked):false;
    // this.setData({address});
 
   
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v=>{
      
          totalPrice+=v.num*v.goods_price;
          totalNum+=v.num;
     
      })
 
      this.setData({
        cart,
        totalPrice,
        totalNum,
        address
      });
    
    
    


  },
//  点击支付
//  handleOrderPay:function(){
//   wx.showToast({
//     title: '支付成功',
//     icon: 'success'
//   })
//   // 支付成功后删除支付过的商品并跳转到购物车页面
//   let newCart = wx.getStorageSync('cart');
//   newCart =newCart.filter(v=>!v.checked);
//   wx.setStorageSync('cart', newCart);
//   setTimeout(() => {
//     // wx.switchTab({
//     //   url: '/pages/cart/index',
//     // })
//           wx.navigateTo({
//           url:'/pages/order/index'
//         });
//   }, 1000);

// },

  

  // 点击支付
  async handleOrderPay(){
 try{
     // 判断缓存中有没有token
      const token=wx.getStorageSync("token");
      // 判断
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        });
       
      }
      
  
      // 创建订单
      // 准备请求头参数
      // const header={Authorization:token};
  
      // 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams={order_price,consignee_addr,goods}
      // 准备发送请求 创建订单 获取订单编号
      const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams});
      console.log(order_number);
      const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      // 发起微信支付
   await requestPayment(pay);
    // console.log(res);
    // 查询后台订单状态
    const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
       console.log(res);
  await showToast({title:"支付成功"});
  // 手动删除缓存中已经支付了的商品
  let newCart=wx.getStorageSync("cart");
  newCart=newCart.filter(v=>!v.checked);
  wx.setStorageSync("cart", newCart);
    
  // 支付成功了跳转到订单页面
  wx.navigateTo({
    url:"/pages/order/index"
  });



  


}catch(error) {
//   await showToast({title:"支付失败"})
// console.log(error);


await wx.showToast({
    title: '支付失败',
    icon: 'error'
  })
  // 支付成功后删除支付过的商品并跳转到购物车页面
  let newCart = wx.getStorageSync('cart');
  newCart =newCart.filter(v=>!v.checked);
  wx.setStorageSync('cart', newCart);
  setTimeout(() => {
    // wx.switchTab({
    //   url: '/pages/cart/index',
    // })
          wx.navigateTo({
          url:'/pages/order/index?type=1'
        });
  }, 1000);





 }


}




  // 设置购物车状态同时重新计算，底部工具栏的数据：全选，总价格，购买的数量



})


  