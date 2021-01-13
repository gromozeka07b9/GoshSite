import React, { Component } from 'react'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -13,
    top: 3,
    border: `0px solid ${theme.palette.background.paper}`,
    padding: '0 0px',
  },
}))(Badge);

const useStyles = withStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

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
//const classes = useStyles();
  render() {
    

    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {

      return (
        <div>
          <GridList cellHeight={260} cols={3}>
            {items.map((item) => (
              <GridListTile key={item.routeId} cols={item.cols || 1}>

                <img src={ item.imgFilename != null && item.imgFilename != "" ? "http://igosh.pro/shared/" + item.imgFilename : "http://igosh.pro/shared/" + item.firstImageName.replace(".jpg","_preview.jpg")} alt={item.name} />

                            <GridListTileBar
              title={item.name}
              titlePosition="top"
              actionIcon={
                <IconButton aria-label={`star ${item.name}`}>
                  <FavoriteIcon />
                </IconButton>
              }
              actionPosition="left"
            />
                <GridListTileBar title={item.createDate} subtitle={item.description} titlePosition="bottom"
                                                          actionIcon={
                                          <IconButton aria-label="cart">
                                            <StyledBadge badgeContent={4} color="secondary">
                                              <FavoriteIcon  />
                                            </StyledBadge>                                            
                                          </IconButton>
                                          }
                                          
                                           actionPosition="right"
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      );
    }
  }
}

export default GridRoutes;