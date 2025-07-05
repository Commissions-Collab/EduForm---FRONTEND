import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <section>
      <div className="text-3xl">SignUp Page</div>
      <div className="text-xl text-blue-400 underline">
        <Link to="/">Sign In </Link>
      </div>
    </section>
  );
};

export default SignUp;
