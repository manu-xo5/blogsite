import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import * as React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useUser } from "../context/user";
import useImage from "../hook/useImage";
import s from "./blog.module.css";
import BlogForm from "../components/BlogForm";
import { Typography } from "@mui/material";

export let category = ["gaming", "music", "informational"];

export default function Blog() {
  let [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  let [message, setMessage] = React.useState("");
  let { jwt } = useUser();

  let { blogId } = useParams();
  let [blog, setBlog] = React.useState(null);
  let [blogError, setBlogError] = React.useState("");
  let [isSaving, setIsSaving] = React.useState(false);
  let shouldUpdate = Boolean(blogId);

  // image preview hooks
  let [blogImage, setBlogImage] = React.useState(null);
  let blogImagePreviewSrc = useImage(blogImage ?? blog?.image);

  async function handleSubmit(ev) {
    ev.preventDefault();

    let html = stateToHTML(editorState.getCurrentContent());

    let body = new FormData(ev.currentTarget);
    body.set("html", html);

    setIsSaving(true);
    let res = await saveBlog(body, { jwt, blogId: blog._id });
    setIsSaving(false);
    let resData = await res.json();

    if (res.ok) {
      setMessage("Blog saved successfully");
      setBlog(resData.blog || resData.newBlog);
    } else {
      setMessage("Failed to save blog: " + resData.message);
    }
  }

  React.useEffect(() => {
    async function main() {
      try {
        if (blogId) {
          let { blog } = await fetch(`/api/blog/${blogId}`).then((res) =>
            res.json()
          );
          let html = convertFromHTML(blog.html);
          setBlog(blog);
          // setBlogImage(blog.image);
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(html.contentBlocks)
            )
          );
        } else {
          setBlog({
            title: "",
            category: category[0],
          });
          setEditorState(EditorState.createEmpty());
        }
      } catch (error) {
        setBlogError(error.message || "Couldn't load blog");
      }
    }

    main();
  }, [blogId]);

  React.useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  return (
    <div className={s.wrapper}>
      {message && <p className={s.message}>{message}</p>}
      {isSaving === true && (
        <p className={s.message}>Saving... the blog changes</p>
      )}

      <Typography as="h1" variant="h2" py="1rem">
        {shouldUpdate ? "Update" : "Create New"} Blog
      </Typography>

      {blog ? (
        <BlogForm
          {...{
            handleSubmit,
            defaults: {
              ...blog,
              image: blogImagePreviewSrc,
            },
            editorState,
            setEditorState,
            shouldUpdate,
            onFileChange: (file) => setBlogImage(file),
          }}
        />
      ) : blogError ? (
        <p>{blogError}</p>
      ) : (
        <p>
          <Spinner />
        </p>
      )}
    </div>
  );
}

async function saveBlog(data, { jwt, blogId }) {
  let shouldUpdate = !!blogId;

  let url = shouldUpdate ? `/api/blog/update/${blogId}` : "/api/blog/new";

  await new Promise((res) => setTimeout(res, 5000));

  let res = await fetch(url, {
    method: "POST",
    body: data,
    headers: {
      Authorization: jwt,
    },
  });

  return res;
}
