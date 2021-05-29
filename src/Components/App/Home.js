import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';
import GoogleLogin from 'react-google-login';
import {
    isMobile, isSafari
} from "react-device-detect";

const styles = {
    root:{
        flexGrow: 1
    },
    appBar:{
      maxWidth:'100%', minHeight:'40px', maxHeight:'50px',margin: '0px', background:'white'
    },
    toolBar:{
        maxWidth:'100%', minHeight:'0px', maxHeight:'50px',margin: '0px'
    },    
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    title: {
        verticalAlign: 'middle',
        display: 'inline-flex'
    },    
    gridContainer:{
        maxWidth:'100%',
        margin:'0px'
    },
    gridList:{
        maxWidth:'100%',
        margin:'0px'
    },
    avatar: {
        margin: 5,
        width:'32px',
        height:'32px'
    }
};

class GridRoutesImgs extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            authAvatarImageUrl: "https://developers.google.com/identity/images/g-logo.png",
            authLoginText: navigator.language.includes("ru") ? "Войти" : "Login",
            authUserId: "",
            authAccessToken: ""
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

        const { classes } = this.props;
        const { error, isLoaded, items } = this.state;

        function getShortName(creatorName) {
            var arr = creatorName.split(' ');
            if(arr.length > 1)
            {
                return creatorName.substr(0,1) + arr[1].substr(0,1);    
            }
             
            return creatorName.substr(0,1);
        }

        function getShortDate(createDate) {
            var dt = new Date(createDate);
            return dt.toLocaleDateString();
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
                    },
                    (error) => {
                        console.log(error);
                        //alert("error");
                    })
        }

        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else {

            return (
                <div className={classes.root}>
                    <AppBar position={"fixed"} className={classes.appBar}>
                        <Toolbar variant="regular" className={classes.toolBar}>
                            <a href="https://igosh.pro">
                                <img src="https://igosh.pro/logo192.png" width={24} height={24} align="left" style={{margin:5}} />
                            </a>
                            <Typography variant="body1" color="inherit">
                                IGOSH.PRO
                            </Typography>
                            <Box margin="0px" display='flex' width='100%' justifyContent='center' >
                            </Box>
                            <Box margin="0px" display='flex' width='100%' justifyContent='right' >
                                <a href="https://play.google.com/store/apps/details?id=com.sd.gosh" style={isSafari ? {display:'none'} : {}}>
                                    <img src="https://igosh.pro/playgoogle.jpg" style={{verticalAlign:'middle'}} width="100px"/>
                                </a>
                            </Box>
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
                    <Box display="flex" justifyContent="center" maxWidth="100%" height='200px' alignItems="center" margin='10px'>
                        <div>
                            <Typography variant="body1" color="inherit" align='center'>
                                Альбомы путешествий - фотографии, рассказы, советы, треки от тех, кто бывает в интересных местах.
                            </Typography>
                            <Typography variant="body1" color="inherit" align='center'>
                                Расскажите друзьям о своем отпуске!
                            </Typography>
                        </div>
                    </Box>
                    <Container className={classes.gridContainer}>
                        <GridList cellHeight={260} cols={isMobile ? 1 : 3} spacing={5} className={classes.gridList}>
                            {items.map((item) => (
                                <GridListTile key={item.routeId} cols={item.cols || 1} component={Link} to={"/routetimeline/" + item.id} params={{name:item.name}}>

                                    <img src={ item.imgFilename != null && item.imgFilename != "" ? "https://igosh.pro/shared/" + item.imgFilename : "https://igosh.pro/shared/" + item.firstImageName.replace(".jpg","_preview.jpg")} alt={item.name} />

                                    <GridListTileBar
                                        title={item.name}
                                        titlePosition="top"
                                        className={classes.titleBar}
                                        actionIcon={
                                            <Avatar className={classes.avatar}>{getShortName(item.creatorName)}</Avatar>
                                        }
                                        actionPosition="left"
                                    />
                                    
                                    <GridListTileBar title={getShortDate(item.createDate)} subtitle={<span>{item.description}</span>} titlePosition="bottom"
                                                     actionIcon={
                                                         <Grid container xs direction="row" spacing={0} justify="flex-end" alignItems="center" style={{marginRight: "40px"}}>
                                                             <Grid item xs>
                                                                 <Badge badgeContent={item.viewCount} color="primary" style={{marginRight:"0px"}}>
                                                                     <img src="../ic_eye_1.png" width="24px" height="24px"/>
                                                                 </Badge>                                                             
                                                             </Grid>
                                                             <Grid item xs>
                                                                 <Badge badgeContent={item.likeCount} color="primary" style={{marginRight: "15px"}}>
                                                                     <img src="../ic_like_on_1.png" width="24px" height="24px"/>
                                                                 </Badge>                                                                 
                                                             </Grid>
                                                         </Grid>
                                                     }
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </Container>
                    <Box display="flex" justifyContent="center" alignItems="center" margin="5px" >
                        <a href="https://play.google.com/store/apps/details?id=com.sd.gosh">
                            <img src="https://igosh.pro/playgoogle.jpg" width="200px"/>
                        </a>
                    </Box>
                </div>
            );
        }
    }
}

export default withStyles(styles)(GridRoutesImgs);