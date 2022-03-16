import Input from "../components/Input";
import Select from "../components/Select";
import s from "./blog.module.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import * as React from "react";
import {
  ContentState,
  convertFromHTML,
  convertFromRaw,
  EditorState,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Button from "../components/Button";
import { useUser } from "../context/user";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import useImage from "../hook/useImage";

export let category = ["gaming", "music", "informational"];

export default function Blog() {
  let [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  let [message, setMessage] = React.useState("Hello World this is sample");
  let { jwt } = useUser();

  let { blogId } = useParams();
  let [blog, setBlog] = React.useState(null);
  let [blogError, setBlogError] = React.useState("");
  let shouldUpdate = Boolean(blogId);

  // image preview hooks
  let [blogImage, setBlogImage] = React.useState(null);
  let blogImagePreviewSrc = useImage(blogImage ?? blog?.image);

  async function handleSubmit(ev) {
    ev.preventDefault();

    let html = stateToHTML(editorState.getCurrentContent());

    let body = new FormData(ev.currentTarget);
    body.set("html", html);
    let res = await fetch(
      shouldUpdate ? `/api/blog/update/${blogId}` : "/api/blog/new",
      {
        method: "POST",
        body: body,
        headers: {
          Authorization: jwt,
        },
      }
    );
    let resData = await res.json();

    if (res.ok) {
      setMessage("Blog saved successfully");
      setBlog(resData.blog);
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

      {blog ? (
        <form onSubmit={handleSubmit}>
          <div className={s.stack}>
            <Input label="title" name="title" defaultValue={blog.title} />

            <Input
              label="image"
              type="file"
              name="image"
              onChange={(ev) => setBlogImage(ev.currentTarget.files[0])}
            />

            <img src={blogImagePreviewSrc} alt="X" width="100%" />

            <Select
              label="Category"
              name="category"
              defaultValue={blog.category}
            >
              {category.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </Select>
          </div>

          <Editor
            wrapperStyle={{
              maxHeight: "60vh",
              overflowY: "auto",
            }}
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
          />

          <Button type="submit">Save</Button>
        </form>
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
