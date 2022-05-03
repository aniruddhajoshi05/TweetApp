import { Button } from "antd";
import React from "react";
import "./Header.css";

export default class Header extends React.Component {
  root = () => {
    this.props.history.push("/");
  };

  register = () => {
    this.props.history.push("/register");
  };

  login = () => {
    this.props.history.push("/login");
  };

  logout = () => {
    localStorage.removeItem("email");
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="header">
        {/* Shows Qkart title image */}
        <div className="header-title">
          <p>Tweet App</p>
        </div>

        {this.props.children}
        {/* Display links based on if the user's logged in or not */}
        <div className="header-action">
          {localStorage.getItem("email") ? (
            <>
              <img
                src="avatar.png"
                alt="profile"
                className="profile-image"
              ></img>

              <div className="header-info">{localStorage.getItem("email")}</div>

              <Button type="primary" onClick={this.logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <div className="header-link">
                <Button type="primary" onClick={this.login}>
                  Login
                </Button>
              </div>

              <div className="header-link">
                <Button type="primary" onClick={this.register}>
                  Register
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
