import "../styles/reset.scss";
import "../styles/global.scss";
import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import Count from "../components/molecules/Count";
import Profile from "../components/molecules/Profile";

const App = () => {
  return (
    <ErrorBoundary>
      <Count />
      <Profile />
    </ErrorBoundary>
  );
};

export default App;
