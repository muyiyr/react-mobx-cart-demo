import { observable, action ,makeAutoObservable,computed} from 'mobx' 
import * as shop from '../api/shop'


export class CartStore {
    constructor (rootStore) {
        makeAutoObservable(this)
        this.rootStore =rootStore
    }
    @observable items = []
  // 结算状态
    @observable checkoutStatus = null

    @action.bound addToCart (product) {
      console.log("走进购物车的方法")
    // 判断购物车数据中是否已经有该商品
    // 如果有，则让购物车中的商品数量+1 
    // 如果没有，则添加新的商品到购物车中
        const prod = this.items.find(cartItem => cartItem.id === product.id)
        if (prod) {
            prod.quantity++
        } else {
            this.items.push({
                id: product.id,
                quantity: 1
            })
        }
        console.log("添加到购物车的商品",this.items)
        // 添加完购物车商品以后，需要让商品列表中的库存数据-1
        this.rootStore.productsStore.decrementInventory(product)

    }

  @computed get cartProducts () {
    const  productsStore  = this.rootStore.productsStore
    console.log("computed",productsStore)
    return this.items.map(cartItem => {
      const prod = productsStore.all.find(prodItem => prodItem.id === cartItem.id)
      return {
        id: prod.id,
        title: prod.title,
        price: prod.price,
        quantity: cartItem.quantity
      }
    })
  }

  @computed get totalPrice () {
    return this.cartProducts.reduce((total, prod) => {
      return total + prod.price * prod.quantity
    }, 0)
  }

  // 结算方法
  @action.bound checkout (products) {
    // 备份购物车数据
    const savedProducts = [...products]
    
    // 清空结算状态
    this.setCheckoutStatus(null)
    
    // 清空购物车
    this.setItems([])

    // 发起结算请求
    //    如果成功：将结算状态设置为 successful
    //    如果失败：将结算状态设置为 failed，还原购物车数据
    shop.buyProducts(
      products,
      () => {
        this.setCheckoutStatus('successful')
      },
      () => {
        this.setCheckoutStatus('failed')
        this.setItems(savedProducts)
      }
    )
  }

  @action.bound setCheckoutStatus (status) {
    this.checkoutStatus = status
  }

  @action.bound setItems (items) {
    this.items = items
  }
}

