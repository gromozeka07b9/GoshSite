import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
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
    isMobile,
    isSafari
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
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AccountCircle from "@material-ui/icons/AccountCircle";

var routeImgFilename = '';

const styles = makeStyles((theme) => ({
    root:{
        flexGrow: 1
    },
    appBar:{
        maxWidth:'100%', minHeight:'40px', maxHeight:'50px',margin: '0px', background:'white'
    },
    toolBar:{
        maxWidth:'100%', minHeight:'0px', maxHeight:'50px',margin: '0px', background:'black'
    },
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
                    routeImgFilename = result[0].imgFilename != null && result[0].imgFilename != "" ? "https://igosh.pro/shared/" + result[0].imgFilename : "https://igosh.pro/shared/" + result[0].firstImageName.replace(".jpg","_preview.jpg");
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

        function hideAppBar() {
            var appBar = document.getElementById('appBar');
            appBar.style.display = 'none';
        }
        
        function showAppBar() {
            var appBar = document.getElementById('appBar');
            appBar.style.display = '';
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
                    <AppBar position={"fixed"} id='appBar' style={{background: 'white', maxWidth:'100%',minHeight:'40px', maxHeight:'70px',margin: '0px'}}>
                        <Toolbar variant="dense" style={{background: 'white', maxWidth:'100%',minHeight:'40px', maxHeight:'70px',margin: '0px'}}>
                            <a href="..">
                                <img src="https://igosh.pro/logo192.png" width={24} height={24} align="left" style={{margin:5}} />
                            </a>
                            <Typography variant="body1" color="inherit">
                                IGOSH.PRO
                            </Typography>
                            <Box margin="0px" display='flex' width='100%' justifyContent='center' >
                            </Box>
                            <a href="https://play.google.com/store/apps/details?id=com.sd.gosh" style={isSafari ? {display:'none'} : {}}>
                                <img src="https://igosh.pro/playgoogle.jpg" style={{verticalAlign:'middle'}} width="100px"/>
                            </a>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Box display="flex" justifyContent="center" alignItems="center" margin="0px">
                        <div style={{width:'100%',height:'300px',overflow:'hidden', opacity:'0.3'}}>
                            <img src={ routeImgFilename } width='100%' style={{verticalAlign:'middle'}} />
                        </div>
                        <div style={{margin: "5px", position:"absolute"}} align="center">
                            <Avatar style={{margin: "5px"}}>{isRouteLoaded ? getShortName(route[0].creatorName) : ""}</Avatar>
                            <Typography variant="h4" style={{margin: "5px", textAlign:"center", width:"100%", color:"black"}}>
                                {isRouteLoaded ? route[0].name : ""}
                            </Typography>
                            <Typography variant="h6" align="center" style={{margin: "5px"}}>
                                {isRouteLoaded ? route[0].description : ""}
                            </Typography>
                        </div>
                    </Box>
                <Container>
                    <Box display="flex" justifyContent="center" alignItems="center">
                    </Box>
                    <GridList cols={1} spacing="0">
                        {items.map((item) => (
                            <GridListTile id={item.routePointId} key={item.routeId} cols={item.cols || 1}>
                                <Container>
                                    <Typography variant="h6" style={{margin: "10px"}}>
                                        {getShortDate(item.createDate)} {item.name}
                                    </Typography>
                                    <Typography variant="body1" align="justify" style={{margin: "10px"}}>
                                        {item.description}
                                    </Typography>
                                    <LightgalleryProvider onAfterOpen={(event, lightgallery_object) => {
                                        hideAppBar();
                                    }} onBeforeClose={(event, lightgallery_object) => {
                                        showAppBar();
                                    }}>
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

export default withStyles(styles)(RouteTimeline);