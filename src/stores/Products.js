import { observable, action , makeAutoObservable } from 'mobx'
import * as shop from '../api/shop'

export class ProductsStore {
  @observable all = []

  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore =rootStore
  }
  
  // 拿到所有的商品
  @action.bound getAllProducts () {
    shop.getAllProducts(products => {
      this.setAll(products)
    })
  }

  @action.bound setAll (products) {
    this.all = products
  }

  @action.bound decrementInventory (product) {
    const prod = this.all.find(item => item.id === product.id)
    prod.inventory--
  }
}