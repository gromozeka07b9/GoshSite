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
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

import * as PT from "prop-types";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import {Helmet} from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AccountCircle from "@material-ui/icons/AccountCircle";
import GoogleLogin from "react-google-login";
import Badge from "@material-ui/core/Badge";

var routeImgFilename = '';

const styles = {
    root:{
        flexGrow: 1,
        margin:'0px',
    },
    appBar:{
        maxWidth:'100%', minHeight:'40px', maxHeight:'50px',margin: '0px', background:'white'
    },
    toolBar:{
        maxWidth:'100%', minHeight:'0px', maxHeight:'50px',margin: '0px'
    },
    paper: {
        padding: '6px 16px',
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
};

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

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            isRouteLoaded: false,
            route: [],
            items: [],
            dimensions: new Map(),
            likeCount: 0,
            isRouteLiked: false,
            authAvatarImageUrl: "https://developers.google.com/identity/images/g-logo.png",
            authLoginText: navigator.language.includes("ru") ? "Войти" : "Login",
            authUserId: "",
            authAccessToken: ""
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
                        route: result,
                        likeCount: result[0].likeCount
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

        const setViewedRoute = () => {
            if(this.state.authAccessToken !== "")
            {
                fetch("https://igosh.pro/api/route/" + this.props.match.params.routeId + "/addviewed", {
                    method: "POST",
                    headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + this.state.authAccessToken},
                })
                    .then(
                        (result) => {
                            console.log(result);
                        },
                        (error) => {
                            console.log(error);
                        })
            }
        }

        const setEmotionRoute = () => {
            if(this.state.authAccessToken !== "")
            {
                fetch("https://igosh.pro/api/likes/" + this.props.match.params.routeId + "/addemotion", {
                    method: "POST",
                    headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + this.state.authAccessToken},
                    body: JSON.stringify({EmotionNum:1})
                })
                    .then(
                        (result) => {
                            console.log(result);
                            let likeCountWithAdded = this.state.likeCount + 1;
                            this.setState({
                                likeCount: likeCountWithAdded,
                                isRouteLiked: true
                            })
                        },
                        (error) => {
                            console.log(error);
                            alert("error");
                        })
            }
        }

        const failureGoogleAuth = (response) => {
            console.log(response);
        }

        const successGoogleAuth = (response) => {
            console.log(response);
            var request = {
                Email: response.profileObj.email,
                Username: response.profileObj.name,
                ImgUrl: response.profileObj.imageUrl,
                AuthenticatorUserId: response.profileObj.googleId
            }
            fetch("https://igosh.pro/api/account/google", {
                method: "POST",
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(request)})
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            //ToDo:imgUrl пока не возвращается с сервера
                            authAvatarImageUrl: response.profileObj.imageUrl,
                            authLoginText: result.username,
                            authUserId: result.userId,
                            authAccessToken: result.access_token
                        })
                        setViewedRoute();
                    },
                    (error) => {
                        console.log(error);
                        //alert("error");
                    })
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
                <div className={classes.root}>
                    <AppBar position={"fixed"} id='appBar' className={classes.appBar}>
                        <Toolbar variant="regular" className={classes.toolBar}>
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
                            <GoogleLogin
                                clientId="784308315468-t4u6of34ddeue7eevr5o8mgdakm4kpbl.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={successGoogleAuth}
                                onFailure={failureGoogleAuth}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                                render={renderProps=>(
                                    <Button onClick={renderProps.onClick} disabled={renderProps.disabled} variant={"text"} size={"small"}>
                                        <Avatar id="avatarElement" alt="Avatar" src={this.state.authAvatarImageUrl} className={classes.avatar}>
                                        </Avatar>
                                        {this.state.authLoginText}
                                    </Button>
                                )}
                            />
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
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <IconButton onClick={setEmotionRoute} disabled={this.state.isRouteLiked || this.state.authAccessToken === ''}
                                    edge="end"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <Badge id="badgeLikeCount" badgeContent={this.state.likeCount} color="primary" style={{margin: "15px"}}>
                                        {this.state.isRouteLiked ? (<img src="../ic_like_on_1.png" width="40px" height="40px"/>) : (<img src="../ic_like_off_1.png" width="40px" height="40px"/>)}
                                    </Badge>
                                </IconButton>
                            </div>
                        </div>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" margin="0px">
                        <div style={{margin: "5px"}} align="center">
                            <Typography variant="h6" align="center" style={{margin: "5px"}}>
                                {isRouteLoaded ? route[0].description : ""}
                            </Typography>
                        </div>
                    </Box>
                    <Timeline>
                        {
                            items.map((item) => (
                                <TimelineItem>
                                    <TimelineOppositeContent style={{ flex: 0.1 }}>
                                        {isMobile ? "" : (<Typography variant={"body2"} color="textSecondary">{getShortDate(item.createDate)}</Typography>)}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator >
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        {isMobile ? (<Typography variant={"body2"} color="textSecondary">{getShortDate(item.createDate)}</Typography>) : ""}
                                        <Typography variant="h6" component="h1">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body1" align="justify" style={{margin: "0px", noWrap:true}}>
                                            {item.description}
                                        </Typography>                                        
                                        <Container>
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
                                    </TimelineContent>
                                </TimelineItem>
                            ))
                        }
                    </Timeline>
                <Container>
                    {/*<GridList cols={1} spacing="0">
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
                            </GridListTile>
                        ))}
                    </GridList>*/}
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