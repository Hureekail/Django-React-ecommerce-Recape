import React, { Component } from "react";
import api from "../api";

export class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    api.get("/api/categories/")
      .then((response) => {
        this.setState({ categories: response.data });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  render() {
    return (
      <div className="categories">
        <div onClick={() => this.props.chooseCategory('all')}>
            All
        </div>
        {this.state.categories.map((el) => (
          <div key={el.id} onClick={() => this.props.chooseCategory(el.name)}>
            {el.name}
          </div>
        ))}
      </div>
    );
  }
}

export default Categories;
