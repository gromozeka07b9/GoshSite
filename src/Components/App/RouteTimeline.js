import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import RouteDetail from "./RouteDetail";
import {makeStyles} from "@material-ui/core/styles";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import {
    LightgalleryProvider,
    LightgalleryItem,
    withLightgallery,
    useLightgallery
} from "react-lightgallery";

import * as PT from "prop-types";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import {Helmet} from "react-helmet";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
    divGalleryItem:{
        width:"auto",
        textAlign:"center",
        padding:'20px',
    },
    imgGalleryItem:{
        width:"0px",
        maxWidth:'0px%',
        height:"0px",
        backgroundColor: "black",
    }
}));

const PhotoItem = ({ image, thumb, group }) => (
    <div style={{ maxWidth: "1200px", width: "100%", padding: "0px" }}>
        <LightgalleryItem group="any" src={image} thumb={thumb}>
            <Paper elevation={5} square>
                <img src={image} style={{ width: "100%" }} />
            </Paper>
        </LightgalleryItem>
    </div>
);
PhotoItem.propTypes = {
    image: PT.string.isRequired,
    thumb: PT.string,
    group: PT.string.isRequired
};

class RouteTimeline extends React.Component{

    /*onImgLoad({target:img}) {
        //this.setState({dimensions:{src:img.src,height:img.offsetHeight,
        //width:img.offsetWidth}});
        var imgs = this.state.dimensions.set({src:img.src,height:img.offsetHeight,
            width:img.offsetWidth})
        this.setState({dimensions:imgs});
    }*/

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            isRouteLoaded: false,
            route: [],
            items: [],
            dimensions: new Map()
        };
        //this.onImgLoad = this.onImgLoad.bind(this);
    }

    componentDidMount() {
        fetch("https://igosh.pro/api/v2/public/routes?pageSize=1000&range=[0,9]&filter={'id':'" + this.props.match.params.routeId + "'}")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isRouteLoaded: true,
                        route: result
                    })
                },
                // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                // чтобы не перехватывать исключения из ошибок в самих компонентах.
                (error) => {
                    this.setState({
                        isRouteLoaded: true,
                        error
                    });
                }
            )
        
        fetch("https://igosh.pro/api/v2/public/RoutePoints?pageSize=1000&range=[0,9]&filter={'routeId':'" + this.props.match.params.routeId + "'}")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    })
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
        let firstImgs = new Map();

        const { error, isLoaded, isRouteLoaded, route, items, dimensions } = this.state;
        const { classes } = this.props;
        function getImgColumnCount(point) {
            if(point.medias.length > 2 && point.medias.length%2 != 0){
                if(!firstImgs.has(point))
                {
                    firstImgs.set(point);
                    return 2;
                }
            }

            return 1;
        }

        function getShortName(creatorName) {
            var arr = creatorName.split(' ');
            if(arr.length > 1)
            {
                return creatorName.substr(0,1) + arr[1].substr(0,1);
            }

            return creatorName.substr(0,1);
        }
        
        function getCellFullHeight() {
            return isMobile ? 500 : 800;
        }
        function getCellImgHeight() {
            //alert(p);
            return isMobile ? 350 : 660;
        }

        function getShortDate(createDate) {
            var dt = new Date(createDate);
            return dt.toLocaleDateString();
        }

        function getDisplayForImg() {
            return isMobile ? "flow" : "flex";
        }

        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>
                <Container>
                    <Typography variant="h4" component="h2" align="center">
                        Загрузка...
                    </Typography>
                </Container>
            </div>;
        } else
            return (
                <div>
                    {/*<MetaTags>
                    <title>{isRouteLoaded ? route[0].name : "GoSh!"}</title>
                    <meta id="og-image" property="og:image" content="path/to/image.jpg" />
                </MetaTags>*/}
                    {/*<Helmet>
                    <meta charSet="utf-8" />
                    <title>My Title</title>
                    <link rel="canonical" href="http://mysite.com/example" />
                </Helmet>*/}                
                <Container>
                    <Box display="flex" justifyContent="center" alignItems="center" margin="5px">
                        <Avatar className={classes.avatar}>{isRouteLoaded ? getShortName(route[0].creatorName) : ""}</Avatar>
                        <Typography variant="h5" align="center" style={{margin: "5px"}}>
                            {isRouteLoaded ? route[0].name : ""}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="subtitle1" align="center" style={{margin: "5px"}}>
                            {isRouteLoaded ? route[0].description : ""}
                        </Typography>
                    </Box>
                    <GridList cols={1} spacing="0">
                        {items.map((item) => (
                            <GridListTile id={item.routePointId} key={item.routeId} cols={item.cols || 1}>
                                <Container>
                                    <Typography variant="body1" style={{margin: "10px"}}>
                                        {getShortDate(item.createDate)} {item.name}
                                    </Typography>
                                    <Typography variant="body1" align="justify" style={{margin: "10px"}}>
                                        {item.description}
                                    </Typography>
                                    <LightgalleryProvider>
                                        <div
                                            style={{
                                                display: getDisplayForImg(),
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            {item.medias.map((p, idx) => (
                                                <PhotoItem key={idx} image={p.url} group="any" />
                                            ))}
                                        </div>
                                    </LightgalleryProvider>
                                </Container>
                                {/*<GridListTileBar
                                title='test title'
                                subtitle={<span>{item.name}</span>}
                                actionIcon={
                                    <IconButton aria-label={`info about Sergey Dyachenko`}>
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />*/}
                            </GridListTile>
                        ))}
                    </GridList>
                    <Box display="flex" justifyContent="center" alignItems="center" margin="5px" >
                        <a href="https://play.google.com/store/apps/details?id=com.sd.gosh">
                            <img src="https://igosh.pro/playgoogle.jpg" width="200px"/>
                        </a>
                    </Box>
                </Container>
                </div>
            );
    }
}

export default withStyles(useStyles)(RouteTimeline);