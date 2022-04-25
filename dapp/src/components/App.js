import React from 'react';
import Login from "./Login/Login";
import "./App.css";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Images from "./Images/Images";
import Gallery from "./Gallery/Gallery";
import Sold from "./Sold/Sold";
import Favorites from "./Favorites/Favorites";
import CleanLayoutRoute from "./../layouts/CleanLayout";
import Home from './Home/Home';
import {getAuthToken} from "./../helpers";
import RegularLayout from "./../layouts/RegularLayout";

class App extends React.Component {

    render(){
        return(
            <Router>
                <Switch>
                    <Route exact path="/"><Redirect to="/login"/></Route>
                    <CleanLayoutRoute path="/login" component={Login}/>

                    <Route path="/images" render={matchProps => getAuthToken() ? (
                    <RegularLayout>
                        <Images {...matchProps} />
                    </RegularLayout>
                    ) : (<Redirect to="/login"/>
                    )} />

                    <Route path="/gallery" render={matchProps => getAuthToken() ? (
                    <RegularLayout>
                        <Gallery {...matchProps} />
                    </RegularLayout>
                    ) : (<Redirect to="/login"/>
                    )} />

                    <Route path="/sold" render={matchProps => getAuthToken() ? (
                    <RegularLayout>
                        <Sold {...matchProps} />
                    </RegularLayout>
                    ) : (<Redirect to="/login"/>
                    )} />

                    <Route path="/favorites" render={matchProps => getAuthToken() ? (
                    <RegularLayout>
                        <Favorites {...matchProps} />
                    </RegularLayout>
                    ) : (<Redirect to="/login"/>
                    )} />

                    <Route path="/home" render={matchProps => getAuthToken() ? (
                    <RegularLayout>
                        <Home {...matchProps} />
                    </RegularLayout>
                    ) : (<Redirect to="/login"/>
                    )} />
                </Switch>
            </Router>
        );
    }

}
export default App;