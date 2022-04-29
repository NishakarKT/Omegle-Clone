import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
// constants
import { MAIN, CHAT } from "./constants/routes";
// components
import Nav from "./components/nav/Nav";
// pages
import Loading from "./pages/loading/Loading";
const Main = lazy(() => import("./pages/main/Main"));
const Chat = lazy(() => import("./pages/chat/Chat"));

function App() {
  return (
    <div className="app">
      <Router>
        <Nav />
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path={MAIN} component={Main} />
            <Route path={CHAT} component={Chat} />
            <Redirect to={MAIN} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
