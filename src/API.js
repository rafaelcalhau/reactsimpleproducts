import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:3001/'
})

const routes = {
	category : {
		create: (data) => api.post('category', data),
		delete: (id) => api.delete('category/' + id),
		get: (id) => api.get('category/' + id),
		getProducts: (id) => api.get('product?category=' + id),
		load : () => api.get('category'),
		update: (data) => api.put('category/' + data.id, data),
	},
	product: {
		create: (data) => api.post('product', data),
		delete: (id) => api.delete('product/' + id),
		get: (id) => api.get('product/' + id),
		update: (data) => api.put('product/' + data.id, data)
	}
}

export default routes