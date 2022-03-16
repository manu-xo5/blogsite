import * as React from "react";
import { BlogCard } from "../components/BlogCard";
import s from "./home.module.css";
import { useUser } from "../context/user";
import { category as _category } from "./blog";

let category = ["all", ..._category];

function Home() {
  let [blogs, setBlogs] = React.useState();
  let [filter, setFilter] = React.useState(category[0]);
  let { user } = useUser();
  let [searchValue, setSearchValue] = React.useState("");

  let derivedBlogs = blogs
    ?.filter((blog) => (filter === "all" ? true : blog.category === filter))
    .filter((blog) => blog.title.includes(searchValue));

  React.useEffect(() => {
    async function main() {
      let res = await fetch("/api/blog/all");
      let resData = await res.json();

      setBlogs(resData.blogs);
    }
    main();
  }, []);

  return (
    <div>
      {blogs === undefined ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p className={s.empty}>No Blogs Yet</p>
      ) : (
        <div>
          <form>
            <input
              name="search"
              placeholder="Search here"
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.currentTarget.value)}
            />
            <select
              name="filter"
              onChange={(ev) => {
                setFilter(category[ev.currentTarget.selectedIndex]);
              }}
            >
              {category.map((opt) => (
                <option>{opt}</option>
              ))}
            </select>
          </form>

          <ul className={s.grid}>
            {derivedBlogs.map((blog) => (
              <li key={blog._id}>
                <BlogCard
                  showEdit={user?.userType === "admin"}
                  _id={blog._id}
                  imgSrc={blog.image}
                  title={blog.title}
                  category={blog.category}
                  html={blog.html}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
