import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Category extends Component {
  constructor(props) {
    super(props)

    this.state = {
      category: {},
      products: {}
    }
  }

  componentDidMount() {
    const catId = this.props.match.params.catId
    this.loadData(catId)
  }

  componentWillReceiveProps(newProps) {
    const catId = newProps.match.params.catId
    this.loadData(catId)
  }

  deleteProduct = (id) => {
    this.props.deleteProduct(id)
  }

  loadData = (catId) => {
    const { database } = this.props

    this.category = database
      .ref('category/'+ catId)
      .orderByChild('name')
      .on('value', snapshot => {

        this.setState({
          category: snapshot.val()
        })

      })

    this.products = database.ref('product')
      .orderByChild('category')
      .equalTo(catId)
      .on('value', snapshot => {

        const products = {}

        snapshot.forEach(item => {
          if (item.val()) {
            products[item.key] = item.val()
          }
        });

        this.setState({
          products: products
        })

      })
  }

  renderProducts = (key) => {

    const product = this.state.products[key]

    return (
      <div key={key} className='well mb-2'>
        {product.name}
        <div className='btn-group pull-right m-fix' role='group'>
          <Link className='btn btn-default btn-sm' to={`/products/edit/${key}`}>
            <i className='glyphicon glyphicon-edit'></i>
          </Link>
          <button type='button' className='btn btn-default btn-sm' onClick={ () => this.deleteProduct(key) }>
            <i className='glyphicon glyphicon-remove'></i>
          </button>
        </div>
      </div>
    )

  } 

  render() {
    const { category, products } = this.state

    if (category == null) {
      return (
        <div className='col-md-12'>
          <h3>Category not found!</h3>
          <p className='text-muted'>The visited category does not exist anymore.</p>
        </div>
      )
    }

    return (
      <div className='col-md-12'>
        <h3>{category.name}</h3>
        <p className='text-muted'>{category.description}</p>
        { Object.keys(products).map(this.renderProducts) }
      </div>
    )
  }
}

export default Category