import React from "react";
import "../App.css";
import illustration from "../assets/hack.png"; // put your SVG/image in assets folder

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left illustration */}
        <div className="login-illustration">
          <img src={illustration} alt="Login Illustration" />
        </div>

        {/* Right form */}
        <div className="login-form">
          <h2>Sign In</h2>
          <form>
            <input type="email" placeholder="Email address" required />
            <input type="password" placeholder="Password" required />

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="btn primary">Sign In</button>

            <div className="divider">OR</div>

            <button className="btn facebook">Continue with Facebook</button>
            <button className="btn twitter">Continue with Twitter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
