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

class App extends Component {
    render() {
        const { history } = this.props

        return (
            <div className="App">
                {/*<Container align="center"> 
                    <img src="http://igosh.pro/logo192.png" width={64} height={64}/>
                </Container>
                <Container>
                    <Typography variant="h4" component="h2" align="center">
                        GoSh!
                    </Typography>
                    <Typography variant="h5" component="h2" align="center">
                        Объединяет фотоальбом, блог и маршрут вашего путешествия
                    </Typography>                
                </Container>*/}
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