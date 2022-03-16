import * as React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";

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
        <main dangerouslySetInnerHTML={{ __html: blog.html }} />
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
