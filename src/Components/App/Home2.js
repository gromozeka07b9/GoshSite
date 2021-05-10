import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import CardActionArea from "@material-ui/core/CardActionArea";
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";

const styles = {
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    avatar: {
        margin: 10,
        backgroundColor: 'rgba(64,64,64,0.7)',
    }
};

class GridRoutesImgs extends React.Component {
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

        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else {

            return (
                <div>
                    {/*<AppBar position={"static"}>
                        <Toolbar>
                            <IconButton edge={"start"} aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                GoSh!
                            </Typography>
                        </Toolbar>
                    </AppBar>*/}
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img src="https://igosh.pro/logo192.png" width={64} height={64} align="center"/>
                        <p><h1>GoSh!</h1></p>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" >
                        <p align="center"><h2>Объединяем фотоальбом, блог и маршрут вашего путешествия!</h2></p>
                    </Box>
                    <Container>
                        <GridList cellHeight={260} cols={isMobile ? 1 : 3} spacing={5}>
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