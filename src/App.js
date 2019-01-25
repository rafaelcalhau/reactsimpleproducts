import React, { Component, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from './Home'

const About = lazy(() => import('./About'))
const Products = lazy(() => import('./Products'))

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			categories: {},
			editingCategoryId: null
		}
	}

	createCategory = async (data) => {

		const { database } = this.props
		const id = database.ref().child('category').push().key
		const categories = {}

		categories['category/'+ id] = data
		await database.ref().update(categories)

	}

	createNewProduct = async (data) => {

		const { database } = this.props
		const id = database.ref().child('product').push().key
		const products = {}

		products['product/' + id] = data
		await database.ref().update(products)

	}

	deleteCategory = async (id) => {

		const { database } = this.props
		
		await database.ref('product').orderByChild('category').equalTo(id).on('value', snapshot => {

			if (snapshot) {
				snapshot.forEach(item => {
					database.ref('product/'+ item.key).remove()
				})
			}
			
		})

		await database.ref('category/' + id).remove()

		this.loadCategories()

	}

	deleteProduct = async (id) => {

		const { database } = this.props
		await database.ref('product/'+ id).remove()

	}

	getCategory = async (id) => {

		const data = {}
		const { database } = this.props

		await database.ref('category/'+ id).on('value', snapshot => {
			
			if (snapshot.val()) {
				const { name, description } = snapshot.val()
				data.name = name
				data.description = description
			}
			
		})
		
		return data

	}

	loadCategories = async () => {

		const { database } = this.props

		this.categories = await database.ref('category')
		await this.categories.on('value', snapshot => {

			if (snapshot.val()) {
				this.setState({ categories: snapshot.val() })
			}

		})

	}

	updateCategory = async ({ id, name, description }) => {
		
		const { database } = this.props
		await database.ref('category/' + id).update({ name, description })
		
	}

	updateProduct = async (key, data) => {

		const { database } = this.props
		await database.ref('product/' + key).update(data)

	}

  render() {
    return (
			<Router>
					{
						/**
						 * We're telling to React that all code 
						 * under Router is managed by Router itself
						 * */
					}
					<div className="App">
						<nav className='navbar navbar-inverse'>
							<div className='container'>
								<div className='navbar-header'>
									<a href='/' className='navbar-brand'>Product Manager</a>
								</div>
								<ul className='nav navbar-nav'>
									<li><Link to='/'>Home</Link></li>
									<li><Link to='/about'>About</Link></li>
									<li><Link to='/products'>Products</Link></li>
								</ul>
							</div>
						</nav>
						<div className='container'>
							<Route component={Home} exact path='/' />
							<Suspense fallback={ <div className="loader">Loading...</div> }>
								<Route component={ () => <About /> } exact path='/about' />
								<Route render={ 
										props => <Products 
																{ ...props }
																database={ this.props.database }
																categories={ this.state.categories } 
																createCategory={ this.createCategory }
																createNewProduct={ this.createNewProduct }
																deleteProduct={ this.deleteProduct } 
																deleteCategory={ this.deleteCategory }
																getCategory={ this.getCategory }
																loadCategories={ this.loadCategories }
																updateCategory={ this.updateCategory }
																updateProduct={ this.updateProduct } /> } 
									path='/products' />
							</Suspense>
						</div>
					</div>
			</Router>
    )
  }
}

export default App
