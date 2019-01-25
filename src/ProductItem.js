import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class ProductItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      product_id: this.props.match.params.id || null,
      category: '',
      name: '',
      redirect: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {

    if (this.state.product_id !== null) {

      const { database } = this.props

      database
        .ref('product/'+ this.state.product_id)
        .on('value', snapshot => {

          if (snapshot.val() !== null) {
            this.setState({
              product_id: snapshot.key,
              category : snapshot.val().category,
              name : snapshot.val().name
            })
          }
          
        })
        
    }

  }

  handleChange(event) {
    const { name, value } = event.target
		
		this.setState({
			[name]: value
		})
  }

  handleSubmit() {

    const { product_id, category, name } = this.state
    const btnSubmit = this.refs.btnSubmit

    if (category === "" || name === "") {
      return false;
    }

    btnSubmit.classList.add('disabled')

    try {

      if (product_id === null) {
        this.props.createNewProduct({ category, name })
      } else {
        this.props.updateProduct(product_id, { category, name })
      }

      this.setState({ name: '', redirect: '/products/category/' + category })
      btnSubmit.classList.remove('disabled')

    } catch (err) {
      console.log(err)
    }
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { categories } = this.props

    return (
      <div className='col-md-12'>
        <h4>
          {
            this.state.product_id === null 
            ? 'Add New Product'
            : 'Edit Category'
          }
        </h4>
        
        <br />
        
        <div className='form-group'>
          <label className='col-md-2 text-right form-label'>Category</label>
          <div className='col-md-5'>
            <select className='form-control' name='category' value={this.state.category} onChange={this.handleChange}>
              {
                Object.keys(categories).map((id) => {
                  const { name } = categories[id]
                  return <option key={id} value={id}>{name}</option>
                })
              }
            </select>
          </div>
          <div className='clearfix'></div>
        </div>

        <div className='form-group'>
          <label className='col-md-2 text-right form-label'>Name</label>
          <div className='col-md-5'>
            <input type='text' name='name' className='form-control' value={this.state.name} onChange={this.handleChange} />
          </div>
          <div className='clearfix'></div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
          
            {
              this.state.product_id === null 
              ? <button ref='btnSubmit' type="submit" className="btn btn-default" onClick={this.handleSubmit}>Create</button>
              : <button ref='btnSubmit' type="submit" className="btn btn-default" onClick={this.handleSubmit}>Save</button>
            }
            
          </div>
        </div>
      </div>
    )

  }

}

export default ProductItem