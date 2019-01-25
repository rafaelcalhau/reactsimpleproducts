import React, { Component, lazy, Suspense } from 'react'
import { Route, Link } from 'react-router-dom'

import CategoryMenu from './CategoryMenu'

const Category = lazy(() => import('./Category'))
const ProductsHome = lazy(() => import('./ProductsHome'))
const ProductItem = lazy(() => import('./ProductItem'))

class Products extends Component {
	constructor(props) {
		super(props)

		this.state = {
			categoryId: null,
			categoryName: '',
			categoryDescription: ''
		}

		this.cancelCategoryEditing = this.cancelCategoryEditing.bind(this)
		this.createCategory = this.createCategory.bind(this)
		this.editCategory = this.editCategory.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
		this.updateCategory = this.updateCategory.bind(this)
	}

	componentDidMount() {
		this.props.loadCategories()
	}

	cancelCategoryEditing() {

		this.setState({
			categoryId: null,
			categoryName: '',
			categoryDescription: ''
		})

	}

	async createCategory() {
		const { categoryName, categoryDescription } = this.state;

		await this.props.createCategory({ 
			name: categoryName, 
			description: categoryDescription 
		})

		this.setState({
			categoryName: '',
			categoryDescription: ''
		})
	}

	editCategory(id) {

		this.props.getCategory(id).then(res => {
			console.log(res)
			this.setState({
				categoryId: id,
				categoryName: res.name,
				categoryDescription: res.description
			})
		})

	}

	handleChange(event) {
		const { name, value } = event.target
		
		this.setState({
			[name]: value
		})
	}

	handleKeyUp(event) {
		if (event.keyCode === 13) {
			const { categoryName, categoryDescription } = this.state;

			if (event.target.name === "categoryName") {
				if (event.target.value !== "") {
					this.refs.categoryDescription.focus()
				}

				return
			}

			if (categoryName !== "" && categoryDescription !== "") {

				if (this.state.categoryId === null) {
					this.createCategory()
				} else {
					this.updateCategory()
				}

			}
		}
	}

	renderCategories = (id) => {
		
		const { name } = this.props.categories[id]
		
		return (
			<li key={id} className='list-group-item'>
				<div className='col-md-8 pd-l-0'>
					<small className='glyphicon glyphicon-chevron-right text-sm'></small> &nbsp;
					<Link to={`/products/category/${id}`} className='v-middle'>{name}</Link>
				</div>
				<div className='col-md-4 no-paddings text-right'>
					<div className="btn-group" role="group">
						<button type='button' className='btn btn-default btn-sm' onClick={ () => { this.editCategory(id) } }>
							<i className='glyphicon glyphicon-edit pull-left'></i>
						</button>
						<button type='button' className='btn btn-default btn-sm' onClick={ () => { this.props.deleteCategory(id) } }>
							<i className='glyphicon glyphicon-remove pull-right'></i>
						</button>
					</div>
				</div>
				<div className='clearfix'></div>
			</li>
		)

	}

	async updateCategory() {

		await this.props.updateCategory({
			id: this.state.categoryId,
			name: this.state.categoryName,
			description: this.state.categoryDescription
		})

		this.setState({
			categoryId: null,
			categoryName: '',
			categoryDescription: ''
		})

	}

	render() {
		const { categories, match } = this.props
		const { categoryName, categoryDescription } = this.state

		return (
			<div>
				<div className='row'>
					<div className='col-md-3'>
					
						<h3>Categories</h3>
						<CategoryMenu categories={categories} 
													renderCategories={this.renderCategories} />

						<div className='well'>
							<input name='categoryName'
								className='form-control mb-2' 
								ref='categoryName' 
								type='text' 
								placeholder='Category name'
								onKeyUp={this.handleKeyUp} 
								onChange={this.handleChange} 
								value={categoryName} />

							<input name='categoryDescription' 
								className='form-control mb-2'
								ref='categoryDescription' 
								type='text'
								placeholder='Description'
								onKeyUp={this.handleKeyUp} 
								onChange={this.handleChange}
								value={categoryDescription} />

							{
								this.state.categoryId == null
									? <button type='button' className='btn btn-block btn-primary' onClick={this.createCategory}> Add </button>
									: <div className="btn-group btn-group-justified" role="group">
											<div className="btn-group" role="group">
												<button type='button' className='btn btn-primary pull-left' onClick={this.updateCategory}> Save </button>
											</div>
											<div className="btn-group" role="group">
												<button type='button' className='btn btn-secondary pull-right' onClick={this.cancelCategoryEditing}> Cancel </button>
											</div>
										</div>
							}
						</div>

					</div>

					<div className='col-md-9'>

						<div className='row'>
							<div className='col-md-10'>
								<h1>Products</h1>
							</div>

							<div className='col-md-2 text-right'>
								<Link to='/products/new' className='btn btn-primary' style={{ marginTop: '20px' }}>New Product</Link>
							</div>
						</div>

						<hr style={{ margin: '0' }} />

						<div className='row'>
							<Suspense fallback={ <div className="loader">Loading...</div> }>
								<Route component={ () => <ProductsHome /> } exact path={match.url} />
								<Route exact path={match.url + '/category/:catId'} render={ 
									props => <Category 
															database={ this.props.database }
															deleteProduct={ this.props.deleteProduct }
															{ ...props } /> 
														} />
								<Route exact path={match.url + '/new'} render={ 
									props => <ProductItem  
															categories={this.props.categories} 
															createNewProduct={this.props.createNewProduct}
															{ ...props } /> 
									} />
								<Route exact path={match.url + '/edit/:id'} 
									render={props => <ProductItem { ...props } 
																			database={ this.props.database }
																			categories={this.props.categories}
																			updateProduct={this.props.updateProduct} />
								} />
							</Suspense>
						</div>

					</div>

				</div>
			</div>
		)
	}
}

export default Products