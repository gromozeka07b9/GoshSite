import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import RouteDetail from "./RouteDetail";
import {makeStyles} from "@material-ui/core/styles";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";

class RouteTimeline extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };        
    }
    
    componentDidMount() {
        fetch("http://igosh.pro/api/v2/public/RoutePoints?pageSize=1000&range=[0,9]&filter={'routeId':'" + this.props.match.params.routeId + "'}")
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
        const useStyles = makeStyles((theme) => ({
            paper: {
                padding: '6px 16px',
            },
            secondaryTail: {
                backgroundColor: theme.palette.secondary.main,
            },
        }));
        const { error, isLoaded, items } = this.state;

        function getImgColumnCount(point) {
            if(point.medias.length > 2){
                if(!firstImgs.has(point))
                {
                    firstImgs.set(point);
                    return 2;
                }                
            }

            return 1;
        }

        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else
        return (
            <GridList cellHeight={800} cols={1} spacing="0">
                {items.map((item) => (
                    <GridListTile key={item.routeId} cols={item.cols || 1}>
                        <Paper elevation={3}>
                        <Typography variant="h3" component="h2">
                          {item.name}
                        </Typography>
                        <Typography variant="h6" component="h5">
                          {item.description}
                        </Typography>     
                        <GridList cols={item.medias.length < 2 || isMobile ? 1 : 2} cellHeight={660}>
                            {item.medias.map((imgitem) => (
                                <GridListTile key={imgitem} cols={getImgColumnCount(item)}>
                                    <img src={imgitem.url} alt={imgitem.url} />
                                    <GridListTileBar
                                        title="test"
                                        subtitle={<span>by: Sergey Dyachenko</span>}
                                        actionIcon={
                                            <IconButton aria-label={`info about Sergey Dyachenko`}>
                                                <InfoIcon />
                                            </IconButton>
                                        }
                                    />
                                </GridListTile>
                            ))}
                        </GridList>                       
                        </Paper>
                    </GridListTile>
                ))}
            </GridList>
        );
    }
}

export default RouteTimeline;