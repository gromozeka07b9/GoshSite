import React, { Component } from 'react';
import Container from '@material-ui/core/Container';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import RouteDetail from './RouteDetail'
import GridRoutesCards from './Home'
import GridRoutesImgs from './Home2'
import Typography from "@material-ui/core/Typography";
import RouteTimeline from './RouteTimeline'
import ImgGallery from './ImgGallery'
import MetaTags from 'react-meta-tags';

class App extends Component {
    render() {
        const { history } = this.props

        return (
            <div className="App">
                <MetaTags>
                    <title>GoSh!</title>
                </MetaTags>
                <Switch>
                    <Route history={history} path='/home' component={GridRoutesImgs} /> 
                    <Route history={history} path='/routetimeline/:routeId' component={RouteTimeline} />
                    <Redirect from='/' to='/home'/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(App)