import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import socketIO from 'socket.io-client';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth_service";

import Login from "./components/login_component";
import Register from "./components/register_component";
import Home from "./components/home_component";
import Profile from "./components/profile_component";
import Rooms from "./components/rooms_component";
import ChatPage from "./components/chat_component";

const socket = socketIO.connect('http://localhost:4000');
class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              Messaging App
            </Link>
            <div className="navbar-nav mr-auto">
              {currentUser && (
                  <>
                    <li className="nav-item">
                      <Link to={"/rooms"} className="nav-link">
                        Rooms
                      </Link>
                    </li>
                  </>
              )}
            </div>

            {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link">
                      User Profile: {currentUser.username}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={this.logOut}>
                      LogOut
                    </a>
                  </li>
                </div>

            ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Sign Up
                    </Link>
                  </li>
                </div>
            )}
          </nav>

          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rooms" element={<Rooms /> } />
              <Route path="/chat/:roomId" element={<ChatPage socket={socket} />} />
            </Routes>
          </div>
        </div>
    );
  }
}

export default App;