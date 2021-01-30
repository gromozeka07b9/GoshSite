import React, { Component } from 'react';
import Container from '@material-ui/core/Container';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import Home from './Home'
import RouteDetail from './RouteDetail'
import GridRoutes from './Home'
import Typography from "@material-ui/core/Typography";
import RouteTimeline from './RouteTimeline'


class App extends Component {
    render() {
        const { history } = this.props

        return (
            <div className="App">
                <Container>
                    <Typography variant="h4" component="h2" align="center">
                        GoSh!
                    </Typography>
                </Container>
                <Switch>
                    <Route history={history} path='/home' component={GridRoutes} />
                    <Route history={history} path='/routedetail/:routeId' component={RouteDetail} />
                    <Route history={history} path='/routetimeline/:routeId' component={RouteTimeline} />
                    <Redirect from='/' to='/home'/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(App)