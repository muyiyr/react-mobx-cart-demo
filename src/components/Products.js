import React, {Component} from 'react'
import { observer ,inject} from 'mobx-react'

@inject('productsStore', 'cartStore')
@observer
//把根容器中的其他子容器映射到组件中        坑1 inject要放在observer前面

class Products extends Component {
    render () {
        // console.log(this.props)
        const { productsStore , cartStore} = this.props
        console.log("2222",cartStore)

        return (
            <div>
                <h2>Products</h2>
                <ul>
                    {productsStore.all.map(item =>(
                        <li key={item.id}>
                        {item.title} - {item.price} * {item.inventory}
                        <br/>
                        <button
                        disabled={!item.inventory}
                        onClick={() => cartStore.addToCart(item)}>{item.inventory ? 'Add to cart' : 'Sold Out'}</button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    componentDidMount (){
        this.props.productsStore.getAllProducts()
    }
}

export default Products