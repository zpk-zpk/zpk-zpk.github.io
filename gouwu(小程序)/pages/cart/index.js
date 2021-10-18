// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
address:{},
cart:[],
allChecked:false,
totalPrice:0,
totalNum:0
  },

  onShow(){
    // 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    // 获取缓存中的购物车数据
const cart=wx.getStorageSync("cart")||[];
  // 计算全选
  // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address});
    // console.log(address);
  this.setCart(cart);
  //  console.log(cart);
  },

  // 点击收货地址
 async handleChooseAddress(){
    // // 获取收货地址
    // wx.chooseAddress({
    //   success: (result) => {
        
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
      
    // wx.getSetting({
    //   success: (result) => {
    //     // 获取权限状态
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success:(result1)=>{
    //           console.log(result1);
    //         }
    //       });
    //     }else{
    //       wx.openSetting({
    //         success:(result2)=>{
    //           wx.chooseAddress({
    //             success:(result3)=>{
    //               console.log(result3);
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });

    // 获取 权限状态
   try {
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 判断权限状态
    if(scopeAddress === false) {
      // 调用获取收获地址的api
       await openSetting();
      
    }
  //  调用获取收货地址的api
   
      let address=await chooseAddress();
      address.all=address.provinceName+address.cityName+address.detailInfo;
      // 存入到缓存中
      wx.setStorageSync("address", address);
        
       console.log(address);
    
   } catch (error) {
     console.log(error);
   }
      
  },

  // 商品的选中
  handeItemChange(e){
    // 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 获取购物车数组
    let {cart}=this.data;
    // 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 选中状态取反
    cart[index].checked=!cart[index].checked;
   this.setCart(cart);
  },
  // 设置购物车状态同时重新计算，底部工具栏的数据：全选，总价格，购买的数量
setCart(cart){
 
  let allChecked=true;
  let totalPrice=0;
  let totalNum=0;
  cart.forEach(v=>{
    if(v.checked){
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    }else{
      allChecked=false;
    }
  })
  // 判断数组是否为空
  allChecked=cart.length!=0?allChecked:false;
  this.setData({
    cart,
    allChecked,
    totalPrice,
    totalNum
  });
  wx.setStorageSync("cart", cart);

},
// 商品的全选功能
handleItemAllCheck(){
  // 获取data中的数据
  let {cart,allChecked}=this.data;
// 修改值
allChecked=!allChecked;
// 循环修改cart数组中的商品选中状态
cart.forEach(v=>v.checked=allChecked);
// 把修改后的值填充回data或者缓存中
this.setCart(cart);
},
// 商品数量的编辑功能
async handleItemNumEdit(e){
  

  const {operation,id}=e.currentTarget.dataset;
  // console.log(operation,id);
  let {cart}=this.data;
  // 找到需要修改的商品索引
  const index=cart.findIndex(v=>v.goods_id===id);
// 判断是否需要执行删除
if(cart[index].num===1&&operation===-1){
  // 弹窗提示
const res=await showModal({ content: '是否要删除该商品？'});
if (res.confirm) {
  cart.splice(index,1);
  this.setCart(cart);
} 

}else{

  // 进行修改数量
  cart[index].num+=operation;
  // 设置回缓存和data中
  this.setCart(cart);
}
},
// 点击结算
async handlePay(){
  const {address,totalNum}=this.data;
  if(!address.userName){
    await showToast({title:"您还没有选择收货地址"});
      return;
  }
  // 判断用户有没有选购商品
  if(totalNum===0){
    await showToast({title:"您还没有选购商品"});
      return;
  }
  // 跳转到支付页面
  wx.navigateTo({
    url:'/pages/pay/index'
   
  });
    
}
})