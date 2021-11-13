import React, { Component } from 'react';

import {
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom"

import PublicRoutesPage from './PublicRoutes/PublicRoutes'
import RoutePage from './Route/Route'
import MapPage from './Map/Map'
import ImgGallery from './ImgGallery/ImgGallery'
import MetaTags from 'react-meta-tags';

class App extends Component {
    render() {
        const { history } = this.props

        return (
            <div className="App">
                <Switch>
                    <Route history={history} path='/map' component={MapPage} />
                    <Route history={history} path='/feed' component={PublicRoutesPage} /> 
                    <Route history={history} path='/route/:routeId' component={RoutePage} />
                    <Redirect from='/' to='/feed' />
                </Switch>
            </div>
        );
    }
}

export default withRouter(App)