import "../styles/reset.scss";
import "../styles/global.scss";
import React, { lazy, Suspense } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
// import { BrowserRouter, Switch } from "react-router-dom";

const Count = lazy(() => import("../components/molecules/Count"));
const Profile = lazy(() => import("../components/molecules/Profile"));
const Loading = () => <div>Loading... ⏰</div>;
const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={Loading}>
        <Count />
      </Suspense>
      <Suspense fallback={Loading}>
        <Profile />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
