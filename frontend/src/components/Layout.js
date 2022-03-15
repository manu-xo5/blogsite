import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ showFooter = true, children }) {
  return (
    <>
      <Navbar />
      {children}
      {showFooter && <Footer />}
    </>
  );
}
