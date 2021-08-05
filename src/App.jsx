import "./App.css";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Count from "./components/Count/Count";
import Profile from "./components/Profile/Profile";

const App = () => {
  return (
    <ErrorBoundary>
      <Count />
      <Profile />
    </ErrorBoundary>
  );
};

export default App;
