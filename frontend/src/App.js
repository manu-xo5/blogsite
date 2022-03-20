import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { useUser } from "./context/user";
import Blog from "./pages/blog";
import Spinner from "./components/Spinner";
import BlogArticle from "./pages/blog/blog-article";
import { useEffect, useState } from "react";

function App() {
  let { user } = useUser();
  let [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize(window.innerWidth);
    });
  }, []);

  return (
    <div className="App">
      <span
        style={{
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
          backgroundColor: "white",
        }}
      >
        {size}
      </span>
      <BrowserRouter>
        {user === null ? (
          <div className="page--spinner">
            <Spinner />
          </div>
        ) : (
          <Routes>
            <Route
              path="/signup"
              element={
                <Layout showFooter={false}>
                  <Signup />
                </Layout>
              }
            />

            <Route
              path="/login"
              element={
                <Layout showFooter={false}>
                  <Login />
                </Layout>
              }
            />

            <Route
              path="*"
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route index element={<Home />} />

              <Route path="blog" element={<Outlet />}>
                <Route
                  index
                  element={
                    user?.userType === "admin" ? (
                      <Blog />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route path="read/:blogId" element={<BlogArticle />} />
              </Route>

              <Route
                path="blog/update/:blogId"
                element={
                  user?.userType === "admin" ? (
                    <Blog />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
