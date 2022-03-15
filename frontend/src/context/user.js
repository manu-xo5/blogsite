import * as React from "react";

let UserCtx = React.createContext();

export function useUser() {
  return React.useContext(UserCtx);
}

export function UserProvider({ children }) {
  let [user, _setUser] = React.useState(null);
  let [jwt, _setJwt] = React.useState(() => localStorage.getItem("JWT_TOKEN"));

  React.useEffect(() => {
    login(jwt);
  }, [jwt]);

  function setJwt(jwt) {
    localStorage.setItem("JWT_TOKEN", jwt);
    _setJwt(jwt);
  }

  async function login(jwt) {
    let res = await fetch("/api/auth/me", {
      headers: {
        Authorization: jwt,
      },
    });
    let user = await res.json();
    _setUser(user.user || undefined);
  }

  return (
    <UserCtx.Provider value={{ user, jwt, setJwt }}>
      {children}
    </UserCtx.Provider>
  );
}
