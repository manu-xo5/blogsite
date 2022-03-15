import * as React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import s from "./signup.module.css";
import { Link } from "react-router-dom";
import Divider from "../components/Divider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user";

export default function Signup() {
  let [error, setError] = React.useState("");
  let [formErrors, setFormErrors] = React.useState(undefined);
  let navigate = useNavigate();
  let { setJwt } = useUser();

  async function handleSubmit(ev) {
    ev.preventDefault();

    // clear previous errors
    setFormErrors();
    setError("");

    let data = Object.fromEntries(new FormData(ev.currentTarget));
    let res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let resData = await res.json();

    if (res.ok) {
      setJwt(resData.jwtToken);
      navigate("/");
    } else {
      setFormErrors(resData.formErrors);
      if (resData.message) setError(resData.message);
    }
  }

  return (
    <div className={s.container}>
      <form className={s.form} onSubmit={handleSubmit}>
        <h1 className={s.heading}>Signup for Blogsite</h1>

        <div className={s.stack}>
          <Input required label="email" name="email" />

          <Input required label="username" name="username" />

          <Input required label="password" name="password" type="password" />

          <Input required label="confirm password" name="confirm_password" />

          {error && <p className={s.error}>{error}</p>}
          {formErrors && (
            <div className={s.errorContainer}>
              {Object.keys(formErrors).map((errorName) => (
                <p>
                  {errorName}: {formErrors[errorName]}
                </p>
              ))}
            </div>
          )}

          <Button type="submit">Sign up</Button>
        </div>

        <div className={s.dividerContainer}>
          <Divider>Or</Divider>

          <p className={s.loginLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
