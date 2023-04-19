import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "./auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#C9CCD5" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul className=" nav nav-dark bg-dark justify-content-center">
      <li className="nav-item ">
        <Link className="nav-link" to="/" style={isActive(history, "/")}>
          Home{" "}
        </Link>
      </li>
      <li className="nav-item ">
        <Link className="nav-link" to="/form" style={isActive(history, "/form")}>
          form
        </Link>
      </li>
      <li className="nav-item ">
        <Link className="nav-link" to="/admin" style={isActive(history, "/admin")}>
          admin
        </Link>
      </li>
    

     
      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item ml-4">
            <Link
              className="nav-link"
              to="/signin"
              style={isActive(history, "/signin")}
            >
              Signin{" "}
            </Link>
          </li>
          <li className="nav-item ml-4">
            <Link
              className="nav-link "
              to="/signup"
              style={isActive(history, "/signup")}
            >
              Signup{" "}
            </Link>
          </li>
          
        </Fragment>
      )}
      {isAuthenticated() && (
        <Fragment>
          {" "}
          <li className="nav-item ml-4">
            <span
              className="nav-link "
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() =>
                signout(() => {
                  history.push("/");
                })
              }
            >
              SignOut{" "}
            </span>
          </li>
          <li className="nav-item ml-4">
            <span
              className="nav-link "
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() => {
              
                history.push("/dashboard");
               
              }
              }
            >
              Dashboard{" "}
            </span>
          </li>
        </Fragment>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
