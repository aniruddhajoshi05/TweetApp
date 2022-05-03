import { LockOutlined, UserOutlined, MobileOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }
  performAPICall = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await fetch(`http://localhost:8080/api/v1.0/tweets/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          contactNumber: this.state.contactNumber,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }),
      });
      console.log("Response == ", response);
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  validateInput = () => {
    if (!this.state.firstName) {
      message.error("FirstName is a required field");
      return false;
    }

    if (!this.state.lastName) {
      message.error("LastName is a required field");
      return false;
    }

    if (!this.state.contactNumber) {
      message.error("ContactNumber is a required field");
      return false;
    }

    if (!this.state.contactNumber.match("[0-9]{10}")) {
      message.error("10 Digit Mobile Number is required");
      return false;
    }

    if (!this.state.email) {
      message.error("Email is a required field");
      return false;
    }

    if (!this.state.email.match("^[A-Za-z0-9+_.-]+@(.+)$")) {
      message.error("Not a valid Email");
    }

    if (!this.state.password) {
      message.error("Password is a required field");
      return false;
    }
    if (this.state.password.length < 8) {
      message.error("Password must be at least 8 characters");
      return false;
    }
    if (this.state.password.length > 20) {
      message.error("Password must be at most 20 characters");
      return false;
    }
    if (this.state.password !== this.state.confirmPassword) {
      message.error("Passwords do not match");
      return false;
    }
    return true;
  };

  validateResponse = (errored, response) => {
    console.log("Validate - ", response);
    if (!response.ok) {
      message.error(
        "This Account is Already Registered or some error at backend"
      );
      return false;
    }

    return true;
  };

  register = async () => {
    if (this.validateInput()) {
      const response = await this.performAPICall();
      if (response) {
        this.setState({
          loading: false,
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        message.success("Registered successfully");
        this.props.history.push("/login");
      }
    }
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history}></Header>

        {/* Display Register fields */}
        <div className="flex-container">
          <div className="register-container container">
            <h1>User Registration</h1>

            {/* Antd component which renders a formatted <input type="text"> field */}
            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="FirstName"
              onChange={(e) => {
                this.setState({
                  firstName: e.target.value,
                });
              }}
            />

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="LastName"
              onChange={(e) => {
                this.setState({
                  lastName: e.target.value,
                });
              }}
            />

            <Input
              className="input-field"
              prefix={<MobileOutlined className="site-form-item-icon" />}
              placeholder="10 Digit Mobile Number"
              onChange={(e) => {
                this.setState({
                  contactNumber: e.target.value,
                });
              }}
            />

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

            {/* Antd component which renders a formatted <input type="password"> field */}
            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />

            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.register}
            >
              Register
            </Button>
          </div>
        </div>

        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Register);
