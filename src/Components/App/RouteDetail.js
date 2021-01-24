import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import {Button} from "@material-ui/core";

class RouteDetail extends React.Component {
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
                        <GridList cellHeight={400} cols={1} spacing="0">
                            {items.map((item) => (
                                <GridListTile key={item.routePointId} cols={item.cols || 1}>
                                    <Container maxWidth="sm">
                                        <Typography variant="h6" component="h2">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="subtitle1" component="h2">
                                            {item.description}
                                        </Typography>
                                        
                                    </Container>
                                </GridListTile>
                            ))}
                        </GridList>
                    </Container>
                </div>
            );
        }
    }
}

export default RouteDetail;