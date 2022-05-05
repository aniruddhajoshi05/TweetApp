import { PlusCircleOutlined, LikeTwoTone } from "@ant-design/icons";
import { Input, Button, message, Rate } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import "./Tweet.css";
import Moment from "react-moment";

//export default function Tweet(props) {
class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deleteId: "",
      replyTweet: "",
      replys: [],
      loadReplys: false,
      editCheck: false,
      updateMessage: "",
    };
  }

  deletePost = async (e, userId, tweetId) => {
    let response = {};
    let errored = false;
    e.preventDefault();
    try {
      response = await (
        await fetch(
          `http://tweetapp-alb-1377564203.us-east-1.elb.amazonaws.com/api/v1.0/tweets/${userId}/delete/${tweetId}`,
          {
            method: "DELETE",
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

    message.info("Deleted Successfully");
    window.location.reload(false);
  };

  validateReplyTweet = () => {
    if (!this.state.replyTweet) {
      message.error("Type Something in your mind ro reply");
      return false;
    }
    return true;
  };

  replyPost = async (e, userId, tweetId) => {
    let response = {};
    let errored = false;
    e.preventDefault();
    if (!this.validateReplyTweet()) {
      return false;
    }

    try {
      response = await (
        await fetch(
          `http://localhost:8081/api/v1.0/tweets/${userId}/reply/${tweetId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userId,
              tweetMessage: this.state.replyTweet,
            }),
          }
        )
      ).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      replyTweet: "",
    });
    message.info("Replied Successfully");
    window.location.reload(false);
  };

  getReplyTweets = async (e, tweetId) => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
      hideReplys: true,
    });
    e.preventDefault();
    try {
      response = await (
        await fetch(`http://localhost:8081/api/v1.0/tweets/reply/${tweetId}`, {
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
      replys: response,
      loadReplys: true,
    });
  };

  updateLike = async (e, userId, tweetId) => {
    let response = {};
    let errored = false;
    e.preventDefault();
    try {
      response = await (
        await fetch(
          `http://tweetapp-alb-1377564203.us-east-1.elb.amazonaws.com/api/v1.0/tweets/${userId}/like/${tweetId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              email: userId,
              tweetId: tweetId,
            }),
          }
        )
      ).json();
    } catch (e) {
      errored = true;
    }

    message.info("Successfully Liked");
    window.location.reload(false);
  };

  updatePost = async (e, userId, tweetId) => {
    let response = {};
    let errored = false;
    e.preventDefault();

    if (!this.validateUpdateTweet()) {
      return false;
    }
    try {
      response = await (
        await fetch(
          `http://localhost:8081/api/v1.0/tweets/${userId}/update/${tweetId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userId,
              tweetId: tweetId,
              tweetMessage: this.state.updateMessage,
            }),
          }
        )
      ).json();
    } catch (e) {
      errored = true;
    }

    message.info("Updated Successfully");
    window.location.reload(false);
  };

  validateReplyTweet = () => {
    if (!this.state.replyTweet) {
      message.error("Type Something in your mind");
      return false;
    }
    return true;
  };

  validateUpdateTweet = () => {
    if (!this.state.updateMessage) {
      message.error("Type Something in your mind");
      return false;
    }
    return true;
  };

  render() {
    return (
      <tr>
        <td>{this.props.tweet.email}</td>
        <td>
          <Moment fromNow>{this.props.tweet.timeStamp}</Moment>
        </td>
        <td>
          {this.props.tweet.likes}{" "}
          <LikeTwoTone
            onClick={(e) =>
              this.updateLike(
                e,
                this.props.tweet.email,
                this.props.tweet.tweetId
              )
            }
          />
        </td>
        <td>
          {this.props.tweet.tweetMessage}
          <Input
            className="input-field"
            placeholder="Add Your Comment"
            onChange={(e) => {
              this.setState({
                replyTweet: e.target.value,
              });
            }}
          />
          <Button
            type="primary"
            onClick={(e) =>
              this.replyPost(
                e,
                localStorage.getItem("email"),
                this.props.tweet.tweetId
              )
            }
          >
            Add Comment
          </Button>

          {this.state.loadReplys &&
            Array.isArray(this.state.replys) &&
            this.state.replys.map((tweet) =>
              tweet.replies.map((reply) => (
                <tr>
                  {<br />}
                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingOne">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <strong>
                            <td>{reply.email}</td>
                          </strong>
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <td>{reply.tweetMessage}</td>
                        </div>
                        <div class="accordion-body">
                          <td>
                            <span class="badge bg-secondary">
                              Posted <Moment fromNow>{reply.timeStamp}</Moment>
                            </span>
                          </td>
                        </div>
                      </div>
                    </div>
                  </div>
                </tr>
              ))
            )}
        </td>
        <td>
          <button
            type="button"
            class="btn btn-primary"
            onClick={(e) => this.getReplyTweets(e, this.props.tweet.tweetId)}
            data-toggle="modal"
            data-target="#exampleModalLong"
          >
            View Comments
          </button>
          <br></br>
          <br></br>
          {this.state.loadReplys && (
            <button
              type="button"
              class="btn btn-primary"
              onClick={(e) => {
                this.setState({
                  loadReplys: "",
                });
              }}
            >
              Hide Comments
            </button>
          )}
        </td>
        <td>
          {this.props.tweet.email == localStorage.getItem("email") &&
          this.state.editCheck ? (
            <div>
              <Input
                className="input-field"
                placeholder="Edit Post"
                value={this.props.tweetMessage}
                onChange={(e) => {
                  this.setState({
                    updateMessage: e.target.value,
                  });
                }}
              />
              <Button
                type="primary"
                onClick={(e) =>
                  this.updatePost(
                    e,
                    this.props.tweet.email,
                    this.props.tweet.tweetId
                  )
                }
              >
                Submit
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={(e) => {
                this.setState({
                  editCheck: true,
                });
              }}
            >
              Update Post
            </Button>
          )}
        </td>
        <td>
          {this.props.tweet.email == localStorage.getItem("email") ? (
            <Button
              type="primary"
              onClick={(e) =>
                this.deletePost(
                  e,
                  this.props.tweet.email,
                  this.props.tweet.tweetId
                )
              }
            >
              Delete Post
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => message.error("Can't delete other's Tweet")}
            >
              Delete Post
            </Button>
          )}
        </td>
      </tr>
    );
  }
}
export default withRouter(Tweet);
