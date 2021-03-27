import React, { Component } from 'react'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import { Button, Paper } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import * as rdd from 'react-device-detect';

import {
  Link
} from "react-router-dom"

function displayWindowSize(){
  // Get width and height of the window excluding scrollbars
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  //rdd.isMobile = w < 600;
}

window.addEventListener("resize", displayWindowSize);

class GridRoutesCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://igosh.pro/api/v2/public/routes?pageSize=1000&range=%5B0%2C999%5D")
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
          <Container>
            <GridList cellHeight={400} cols={isMobile ? 1 : 3} spacing="0">
              {items.map((item) => (
                  <GridListTile key={item.routeId} cols={item.cols || 1}>
                    <Card>
                      <CardHeader
                          avatar={
                            <Avatar aria-label="recipe">
                              ?
                            </Avatar>
                          }
                          title={item.name}
                          subheader={item.createDate}
                      />
                      <CardActionArea component={Link} to={"/routetimeline/" + item.id}>
                        <CardMedia
                            component="img"
                            alt={item.name}
                            height="200"
                            image={ item.imgFilename != null && item.imgFilename != "" ? "https://igosh.pro/shared/" + item.imgFilename : "https://igosh.pro/shared/" + item.firstImageName.replace(".jpg","_preview.jpg")}
                            title={item.name}
                        />
                        <CardContent>
                          <Typography variant="body2" color="textSecondary" component="p" noWrap="false" align="justify">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions disableSpacing="true">
                        <Button size="small" color="primary" href={"/routetimeline/" + item.id}>
                          Читать
                        </Button>
                        <Button size="small" color="primary">
                          Поделиться
                        </Button>
                      </CardActions>
                    </Card>
                  </GridListTile>
              ))}
            </GridList>
          </Container>
        </div>
      );
    }
  }
}

export default GridRoutesCards;