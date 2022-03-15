import Button from "../components/Button";
import Divider from "../components/Divider";
import Input from "../components/Input";
import s from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import { useUser } from "../context/user";

export default function Login() {
  let [error, setError] = React.useState("");
  let { setJwt } = useUser();

  let navigate = useNavigate();

  async function handleSubmit(ev) {
    setError("");
    ev.preventDefault();
    let data = Object.fromEntries(new FormData(ev.currentTarget));
    let res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let resData = await res.json();

    if (res.ok) {
      navigate("/");
      setJwt(resData.jwtToken);
    } else {
      setError(resData.message);
    }
  }

  return (
    <div className={s.bg}>
      <img className={s.image} src={"/login.png"} alt="asdf  jkda ajks djaks" />

      <form className={s.formContainer} onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>

        <div className={s.stack}>
          <Input label="Username" name="username" required />

          <Input label="Password" name="password" type="password" />

          {error && <p className={s.error}>Error: {error}</p>}

          <div className={s.center}>
            <Button type="submit" variant="rounded">
              Login Now
            </Button>
          </div>
        </div>

        <Divider className={s.divider}>or</Divider>

        <p className={s.center}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
