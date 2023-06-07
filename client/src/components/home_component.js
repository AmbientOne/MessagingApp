import React, { Component } from "react";
import AuthService from "../services/auth_service";
import { Navigate } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      // User is logged in, redirect to rooms page
      return <Navigate to="/rooms" />;
    }
    else {
      return <Navigate to="/login" />;

    }
  }
}