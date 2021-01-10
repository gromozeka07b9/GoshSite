import React, { Component } from 'react'

class RouteData extends Component {
	componentDidMount() {
	  fetch('http://igosh.pro/api/v2/public/routes?pageSize=1000&range=%5B0%2C999%5D')
	  .then(route=>route.json())
	  .then((data) => {
	  	this.setState({routes: data })
	  })
	  .catch(console.log)
	}
}

export default RouteData;