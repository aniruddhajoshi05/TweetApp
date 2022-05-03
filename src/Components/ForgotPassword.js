import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      contactNumber: "",
      password: "",
      confirmPassword: "",
      email: "",
    };
  }

  performAPICall = async (email) => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await (
        await fetch(`http://localhost:8080/api/v1.0/tweets/${email}/forgot`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    console.log("login response ", response);
    this.setState({
      loading: false,
    });
    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  validateInput = () => {
    if (!this.state.email) {
      message.error("Email is a required field");
      return false;
    }

    if (!this.state.password) {
      message.error("Password is a required field");
      return false;
    }

    if (this.state.password != this.state.confirmPassword) {
      message.error("Password and Confirm Password Should match");
      return false;
    }

    return true;
  };

  validateResponse = (errored, response) => {
    console.log(response);
    if (!response.email) {
      message.error("Try After Sometime");
      return false;
    }

    return true;
  };

  submit = async () => {
    if (this.validateInput()) {
      const response = await this.performAPICall(this.state.email);
      if (response) {
        this.setState({
          email: "",
          contactNumber: "",
          confirmPassword: "",
          password: "",
        });
        message.success("Password Changed Successfully");
        this.props.history.push("/login");
      }
    }
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display Login fields */}
        <div className="flex-container">
          <div className="login-container container">
            <h1>Reset Password to Login in Tweet App</h1>

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              onChange={(e) => {
                this.setState({
                  email: e.target.value,
                });
              }}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="New Password"
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm New Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />

            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.submit}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Login);
