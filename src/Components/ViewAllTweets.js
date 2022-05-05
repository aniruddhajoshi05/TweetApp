import React from "react";
import { withRouter } from "react-router-dom";
import { Input, message } from "antd";
import Header from "./Header";
import Tweet from "./Tweet";
import { Button } from "antd";

class ViewAllTweets extends React.Component {
  constructor(props) {
    super(props);
    this.tweets = [];
    this.state = {
      loading: false,
      userTweets: [],
      tweetMessage: "",
      timeStamp: "",
      email: "",
      likes: "",
      loggedIn: false,
      newPost: "",
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
        await fetch(
          `http://tweetapp-alb-1377564203.us-east-1.elb.amazonaws.com/api/v1.0/tweets/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
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

  getAllTweets = async () => {
    const response = await this.performAPICall();

    if (response) {
      this.tweets = response;
      this.setState({
        userTweets: response,
      });
    }
  };

  componentDidMount() {
    this.getAllTweets();
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

  getTweetElement = (tweet) => {
    return <Tweet tweet={tweet} />;
  };

  viewMyTweets = () => {
    this.props.history.push("/tweets");
  };

  viewAllTweets = () => {
    this.props.history.push("/viewAllTweets");
  };

  viewUsers = () => {
    this.props.history.push("/viewUsers");
  };

  validateTweet = () => {
    if (!this.state.newPost) {
      message.error("Type Something in your mind");
      return false;
    } else {
      this.postTweet(localStorage.getItem("email"));
    }
  };

  postTweet = async (email) => {
    let response = {};
    let errored = false;
    try {
      response = await (
        await fetch(
          `http://tweetapp-alb-1377564203.us-east-1.elb.amazonaws.com/api/v1.0/tweets/${email}/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              email: localStorage.getItem("email"),
              tweetMessage: this.state.newPost,
            }),
          }
        )
      ).json();
    } catch (e) {
      errored = true;
    }

    console.log(response);
    if (!response) {
      this.setState({
        newPost: "",
      });
      message.error("Tweet Failed!! Tweet should not go beyond 144 characters");
    } else {
      this.setState({
        newPost: "",
      });
      message.info("Successfully Posted");
      window.location.reload(false);
    }
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history}>
          <Input
            placeholder="Post Tweet"
            onChange={(e) => {
              this.setState({
                newPost: e.target.value,
              });
            }}
            style={{
              width: "30%",
            }}
          />

          <Button
            loading={this.state.loading}
            type="primary"
            onClick={this.validateTweet}
          >
            Post
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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Posted Date</th>
                <th scope="col">Likes</th>
                <th scope="col">Post</th>
                <th scope="col">View Replies</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.userTweets.length !== 0 ? (
                Array.isArray(this.state.userTweets) &&
                this.state.userTweets.map((tweet) =>
                  this.getTweetElement(tweet)
                )
              ) : this.state.loading ? (
                <div className="loading-text">Loading Tweets...</div>
              ) : (
                <div className="loading-text">No tweets to Display</div>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default withRouter(ViewAllTweets);
