import React, { Component } from "react";
import LogoutComponent from "./LogoutComponent";
import FormComponent from "./FormComponent";

class DashboardComponent extends Component {
  render() {
    return (
        <div>
            <LogoutComponent></LogoutComponent>
            <FormComponent></FormComponent>
        </div>
    );
  }
}

export default DashboardComponent;
