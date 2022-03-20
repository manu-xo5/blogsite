import * as React from "react";
import { BlogCard } from "../components/BlogCard";
import s from "./home.module.css";
import { useUser } from "../context/user";
import { category as _category } from "./blog";
import Spinner from "../components/Spinner";

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
        <p className={s.blogMessage}>
          <Spinner />
        </p>
      ) : blogs.length === 0 ? (
        <p className={s.blogMessage}>No Blogs Yet</p>
      ) : (
        <div>
          <form
            className={s.queryContainer}
            onSubmit={(ev) => ev.preventDefault()}
          >
            <input
              name="search"
              placeholder="Search here"
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.currentTarget.value)}
              className={s.searchInput}
            />

            <div className={s.selectContainer}>
              <span>Category:</span>
              <select
                className={s.select}
                name="filter"
                onChange={(ev) => {
                  setFilter(category[ev.currentTarget.selectedIndex]);
                }}
              >
                {category.map((opt) => (
                  <option>{opt}</option>
                ))}
              </select>
            </div>
          </form>

          {derivedBlogs.length === 0 ? (
            <p className={s.blogMessage}>Can't find any blog for your query</p>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
