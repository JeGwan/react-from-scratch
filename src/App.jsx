import "./App.css";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Count from "./components/Count/Count";

const App = () => {
  return (
    <ErrorBoundary>
      <Count />
    </ErrorBoundary>
  );
};

export default App;
