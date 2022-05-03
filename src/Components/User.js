import React from "react";
import { withRouter } from "react-router-dom";
import "./User.css";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatePasswordCheck: false,
    };
  }

  render() {
    return (
      <tr>
        <td>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName} </td>
        <td>{this.props.user.email} </td>
      </tr>
    );
  }
}
export default withRouter(User);
