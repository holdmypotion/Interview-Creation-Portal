import { useEffect } from "react";
import Router from "next/router";

const LandingPage = () => {
  useEffect(() => {
    Router.push("/auth/signup");
  }, []);
  return (
    <div>
      <h1>Welcome to the Interview Creation Portal</h1>
      <h3>Please sign in / sign up.</h3>
    </div>
  );
};
export default LandingPage;
