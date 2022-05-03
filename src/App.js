import "antd/dist/antd.css";
import React, { useLayoutEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ViewMyTweets from "./Components/ViewMyTweets";
import ViewAllTweets from "./Components/ViewAllTweets";
import Users from "./Components/Users";
import "./App.css";
import ForgotPassword from "./Components/ForgotPassword";

export default function App(props) {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/register">
            <Register />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/tweets">
            <ViewMyTweets />
          </Route>

          <Route path="/viewAlltweets">
            <ViewAllTweets />
          </Route>

          <Route path="/viewUsers">
            <Users />
          </Route>

          <Route path="/forgotPassword">
            <ForgotPassword />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
