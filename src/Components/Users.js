import React from "react";
import { withRouter } from "react-router-dom";
import { Input, message, DatePicker } from "antd";
import Header from "./Header";
import { Button } from "antd";
import User from "./User";

class Users extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      loggedIn: false,
      user: [],
      loadUser: false,
      search: "",
    };
  }

  performAPICall = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });

    try {
      response = await (
        await fetch(`http://localhost:8081/api/v1.0/tweets/users/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
      loggedIn: true,
    });
    return response;
  };

  getUsers = async () => {
    const response = await this.performAPICall();

    if (response) {
      this.loadUser = true;
      this.setState({
        user: response,
      });
    }
  };

  searchUser = async () => {
    let response = {};
    let errored = false;

    if (!this.validateSearchUser()) {
      return false;
    }

    try {
      response = await (
        await fetch(
          `http://localhost:8081/api/v1.0/tweets/user/search/${this.state.search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ).json();
    } catch (e) {
      errored = true;
    }

    if (response) {
      this.loadUser = true;
      this.setState({
        user: response,
      });
    }

    console.log(this.state.user);
  };

  validateSearchUser = () => {
    if (!this.state.search) {
      message.error("Enter email id to search");
      return false;
    }
    return true;
  };

  componentDidMount() {
    this.getUsers();
    if (localStorage.getItem("email")) {
      this.setState(
        {
          loggedIn: true,
        },
        () => {
          console.log(this.state.loggedIn, "loggedIn");
        }
      );
    }
  }

  viewMyTweets = () => {
    this.props.history.push("/tweets");
  };

  viewAllTweets = () => {
    this.props.history.push("/viewAllTweets");
  };

  viewUsers = () => {
    this.props.history.push("/viewUsers");
  };

  getUserElement = (user) => {
    return <User user={user} />;
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history}>
          <Input
            placeholder="Search User by Email"
            onChange={(e) => {
              this.setState({
                search: e.target.value,
              });
            }}
            style={{
              width: "30%",
            }}
          />

          <Button
            loading={this.state.loading}
            type="primary"
            onClick={this.searchUser}
          >
            Search
          </Button>
        </Header>

        <div className="sidenav">
          <ul>
            <Button
              type="success"
              onClick={this.viewMyTweets}
              style={{ margin: 5 }}
            >
              View My Tweets
            </Button>

            <Button
              type="success"
              onClick={this.viewAllTweets}
              style={{ margin: 5 }}
            >
              View All Tweets
            </Button>

            <Button
              type="success"
              onClick={this.viewUsers}
              style={{ margin: 5 }}
            >
              View Users
            </Button>
          </ul>
        </div>

        <div className="tweet-container">
          {this.state.user.length !== 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">FirstName</th>
                  <th scope="col">LastName</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                {this.state.user.length ? (
                  this.state.user.map((usrDtls) => (
                    <tr>
                      <td>{usrDtls.firstName}</td>
                      <td>{usrDtls.lastName} </td>
                      <td>{usrDtls.email} </td>
                    </tr>
                  ))
                ) : this.state.loading ? (
                  <div className="loading-text">Loading User...</div>
                ) : this.state.user.email != null ? (
                  <tr>
                    <td>{this.state.user.firstName}</td>
                    <td>{this.state.user.lastName} </td>
                    <td>{this.state.user.email} </td>
                  </tr>
                ) : (
                  <div className="loading-text">{this.state.user.email}</div>
                )}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }
}
export default withRouter(Users);
