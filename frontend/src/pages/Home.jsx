import React, { useEffect } from "react";
import Header from "../components/Header"
import Footer from "../components/Footer";
import Items from "../components/items";
import Categories from "../components/Categories";
import ShowFullItem from "../components/ShowFullItem";
import SearchBar from "../components/SearchBar";
import api from "../api";
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      currentItems: [],
      items: [],
      showFullItem: false,
      fullItem: {},
    }
    this.addToOrder = this.addToOrder.bind(this)
    this.deleteOrder = this.deleteOrder.bind(this)
    this.chooseCategory = this.chooseCategory.bind(this)
    this.onShowItem = this.onShowItem.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.saveOrdersToDatabase = this.saveOrdersToDatabase.bind(this)
  }


  componentDidMount() {
    // Load orders from localStorage if they exist
    const savedOrders = localStorage.getItem('guestOrders');
    if (savedOrders) {
      this.setState({ orders: JSON.parse(savedOrders) });
    }

    api.get("/api/products/")
      .then((response) => {
        this.setState({ 
          items: response.data,
          currentItems: response.data 
        });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  componentDidUpdate(prevProps) {
    // Check if user just authenticated
    if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
      this.saveOrdersToDatabase();
    }
  }

  saveOrdersToDatabase() {
    // Save each order to database
    this.state.orders.forEach(order => {
      api.post("/api/add-order/", {
        product_id: order.id
      })
      .then(response => {
        console.log("Order saved to database:", response.data);
      })
      .catch(error => {
        console.error("Error saving order to database:", error);
      });
    });
  }

  render() {
    return (
      <>
        <div className="wrapper">
          <Header orders={this.state.orders} onDelete={this.deleteOrder} />
          <SearchBar items={this.state.items} onSearch={this.handleSearch}/>
          <Categories chooseCategory={this.chooseCategory}/>
          <Items 
            onShowItem={this.onShowItem} 
            items={this.state.currentItems} 
            onAdd={this.addToOrder}
            onDelete={this.deleteOrder}
            orders={this.state.orders}
          />

          {this.state.showFullItem && (
            <ShowFullItem 
              item={this.state.fullItem} 
              onAdd={this.addToOrder} 
              onShowItem={this.onShowItem}
              onDelete={this.deleteOrder}
              orders={this.state.orders}
            />
          )}
        </div>
        <Footer />
      </>
    );
  }

  onShowItem(item) {
    this.setState({fullItem: item})
    this.setState({showFullItem: !this.state.showFullItem})
  }

  chooseCategory(category) {

    if(category === 'all') {
      this.setState({currentItems: this.state.items})
      return
    }

    this.setState({
      currentItems: this.state.items.filter(el => el.category === category)
    })
  }

  deleteOrder(id) {
    const newOrders = this.state.orders.filter(el => el.id !== id);
    this.setState({ orders: newOrders });
    
    // Update localStorage
    localStorage.setItem('guestOrders', JSON.stringify(newOrders));
  }

  
  addToOrder(item) {
    let isInArray = false
    this.state.orders.forEach(el => {
      if(el.id === item.id)
        isInArray = true
    })
    if(!isInArray) {
      const newOrders = [...this.state.orders, item];
      this.setState({orders: newOrders});
      
      // Save to localStorage for non-authenticated users
      localStorage.setItem('guestOrders', JSON.stringify(newOrders));
      
      const accessToken = localStorage.getItem('access')
      if (accessToken) {
        api.post("/api/orders/", {
          product_id: item.id
        })
        .then(response => {
          console.log("Order saved to database:", response.data);
        })
        .catch(error => {
          console.error("Error saving order to database:", error);
        });
      }
    }
  }

  handleSearch(filteredItems) {
    this.setState({ currentItems: filteredItems })
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Home);