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
import UpdateBlog from "./pages/blog/update";

function App() {
  let { user } = useUser();

  return (
    <div className="App">
      <BrowserRouter>
        {user === null ? (
          <Spinner />
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

              <Route
                path="blog"
                element={
                  user?.userType === "admin" ? (
                    <Blog />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="blog/update"
                element={
                  user?.userType === "admin" ? (
                    <UpdateBlog />
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
