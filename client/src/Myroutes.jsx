import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./SignupForm";
import Signin from "./SigninForm";
import Home from "./Home";
import InputTransactions from "./InputTransactions";
import Dashboard from "./Dashboard";
import ShowTransactions from "./ShowTransactions";
import UpdateTransactions from "./UpdateTransactions";
import PrivateRoute from "./PrivateRoute";
import Form from "./Form";
import Admin from "./Admin";

const Myroutes = () => {
  const PrivateDashboardRoute = () => (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
  const PrivateFromRoute = () => (
    <PrivateRoute>
      <Form />
    </PrivateRoute>
  );
   const AdminRoute = () => (
    <PrivateRoute>
      <Admin />
    </PrivateRoute>
  );

  const PrivateCreateRoute = () => (
    <PrivateRoute>
      <InputTransactions />
    </PrivateRoute>
  );

  const PrivateUpdateRoute = () => (
    <PrivateRoute>
      <UpdateTransactions />
    </PrivateRoute>
  );
  const PrivateReadRoute = () => (
    <PrivateRoute>
      <ShowTransactions />
    </PrivateRoute>
  );

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <Route
          path="/dashboard"
          exact
          component={PrivateDashboardRoute}
        ></Route>
        <Route path="/add-transactions" exact component={PrivateCreateRoute} />
        <Route path="/show-transactions" exact component={PrivateReadRoute} />
        <Route
          path="/update-transactions/:id"
          exact
          component={PrivateUpdateRoute}
        />
        <Route path="/form" exact component={PrivateFromRoute} />
        <Route path="/admin" exact component={AdminRoute} />
      </Switch>
    </BrowserRouter>
  );
};

export default Myroutes;
