import * as React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import s from "./blog-article.module.css";

function BlogArticle() {
  let { blogId } = useParams();
  let [blog, setBlog] = React.useState(null);
  let [error, setError] = React.useState("");

  React.useEffect(() => {
    async function main() {
      try {
        let { blog } = await fetch(`/api/blog/${blogId}`).then((res) =>
          res.json()
        );

        if (!blog) {
          setError("Couldn't load the blog");
        }

        setBlog(blog);
      } catch {
        setError("Couldn't load the blog");
      }
    }
    main();
  }, [blogId]);

  return (
    <>
      {blog ? (
        <main className={s.wrapper}>
          <div className={s.meta}>
            <h1>{blog.title}</h1>
            <p>Category: {blog.category}</p>
          </div>
          <img className={s.cover} src={blog.image} alt="cover poster" />
          <article
            className={s.content}
            dangerouslySetInnerHTML={{ __html: blog.html }}
          />
        </main>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>
          <Spinner />
        </p>
      )}
    </>
  );
}

export default BlogArticle;
