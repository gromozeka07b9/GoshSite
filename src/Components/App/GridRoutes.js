import React, { Component } from 'react'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


class GridRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://igosh.pro/api/v2/public/routes?pageSize=1000&range=%5B0%2C999%5D")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {


    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
        <div>
          <GridList cellHeight={160} cols={3}>
            {items.map((item) => (
              <GridListTile key={item.routeId} cols={item.cols || 1}>
                <img src={ item.imgFilename != null && item.imgFilename != "" ? "http://igosh.pro/shared/" + item.imgFilename : "http://igosh.pro/images/icon.png"} alt={item.name} />
              </GridListTile>
            ))}
          </GridList>
        </div>
      );
    }
  }
}

export default GridRoutes;