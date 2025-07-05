import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <section>
      <div className="text-3xl">SignIn Page</div>
      <div className="text-xl text-red-400 underline">
        <Link to="/sign-up">Sign Up </Link>
      </div>
    </section>
  );
};

export default SignIn;
