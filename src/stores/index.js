import {ProductsStore}  from "./Products";
import {CartStore} from "./Cart";
import {makeAutoObservable} from 'mobx'

export class RootStore {
    constructor () {
        makeAutoObservable(this)
        this.productsStore = new ProductsStore(this)
        this.cartStore = new CartStore(this)
      }
};