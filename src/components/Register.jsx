import React from "react";
import "../App.css";
import illustration from "../assets/hack.png"; // reuse or replace with another image

function Register() {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left illustration */}
        <div className="login-illustration">
          <img src={illustration} alt="Register Illustration" />
        </div>

        {/* Right form */}
        <div className="login-form">
          <h2>Create Account</h2>
          <form>
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />

            <button type="submit" className="btn primary">
              Register
            </button>

            <div className="divider">OR</div>

            <button className="btn facebook">Sign up with Facebook</button>
            <button className="btn twitter">Sign up with Twitter</button>
          </form>

          <p className="text-center" style={{ marginTop: "15px" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#0d6efd", textDecoration: "none" }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
