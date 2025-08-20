import React, { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "../lib/supabaseClient";

export default function Login() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      window.location.href = "/dashboard";
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) throw error;
      // eslint-disable-next-line no-alert
      alert("Check your email for confirmation to complete sign up.");
      setTab("login");
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Login</button>
          <button className={tab === "signup" ? "active" : ""} onClick={() => setTab("signup")}>Sign Up</button>
        </div>

        <form onSubmit={tab === "login" ? handleLogin : handleSignup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
          <button className="btn" type="submit">{tab === "login" ? "Login" : "Create account"}</button>
        </form>
      </div>
    </div>
  );
}
