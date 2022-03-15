import { Link } from "react-router-dom";
import s from "./Navbar.module.css";
import { useUser } from "../context/user";

export default function Navbar() {
  let { user, setJwt } = useUser();

  console.log(user);

  return (
    <nav className={s.nav}>
      <Link to="/" className={s.logo}>
        <img
          className={s.logoImg}
          src="favicon.ico"
          alt="react offical rotating atom icon"
        />
        <span>Blogsite</span>
      </Link>

      <ul className={s.menu}>
        {user?.userType === "admin" && (
          <li className={`${s.admin} ${s.badge}`}>admin</li>
        )}

        <li>
          <Link className={s.menuLink} to="/blog">
            Blog
          </Link>
        </li>

        <li>
          {user == null ? (
            <Link className={s.menuLink} to="/login">
              Login
            </Link>
          ) : (
            <Link
              className={s.menuLink}
              onClick={() => {
                setJwt("");
              }}
              to="/"
            >
              Logout
            </Link>
          )}
        </li>

        <li>
          <Link className={s.menuLink} to="/about">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
