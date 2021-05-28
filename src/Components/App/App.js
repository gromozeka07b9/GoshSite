import React, { Component } from 'react';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import GridRoutesImgs from './Home'
import RouteTimeline from './RouteTimeline'
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