import React, { Component } from 'react'

class CategoryMenu extends Component {

  render() {

    const { categories } = this.props

    return (
      <ul className="list-group">
        { Object.keys(categories).map(item => this.props.renderCategories(item)) }
      </ul>
    )

  }

}

export default CategoryMenu