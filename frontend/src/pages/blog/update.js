import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Spinner from "../../components/Spinner";
import { useUser } from "../../context/user";
import s from "./update.module.css";

let category = ["gaming", "music", "informational"];

export default function UpdateBlog() {
  let [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  let [blog, setBlog] = React.useState(null);
  let [message, setMessage] = React.useState("");
  let { jwt } = useUser();
  let search = useLocation().search;
  let params = new URLSearchParams(search);
  let blogId = params.get("id");

  async function handleSubmit(ev) {
    ev.preventDefault();

    let html = stateToHTML(editorState.getCurrentContent());

    let body = new FormData(ev.currentTarget);
    body.set("html", html);
    let res = await fetch("/api/blog/update", {
      method: "POST",
      body: body,
      headers: {
        Authorization: jwt,
      },
    });
    let resData = await res.json();

    if (res.ok) {
      setMessage("Blog saved successfully");
    } else {
      setMessage("Failed to save blog: " + resData.message);
    }
  }

  React.useEffect(() => {
    async function main() {
      let res = await fetch(`/api/blog/${blogId}`);
      let resData = await res.json();

      const blocksFromHTML = convertFromHTML(resData.blog.html);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );

      setEditorState(EditorState.createWithContent(convertFromHTML(state)));

      setBlog(resData.blog);
    }
    main();
  }, [blogId]);

  return (
    <div>
      {message && <p className={s.message}>{message}</p>}

      {blog === null ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={s.stack}>
            <Input label="title" name="title" defaultValue={blog.title} />

            <Input label="image" type="file" name="image" />

            <Select
              label="Category"
              name="category"
              defaultValue={blog.category}
            >
              {category.map((opt) => (
                <option>{opt}</option>
              ))}
            </Select>
          </div>

          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
          />

          <Button type="submit">Save</Button>
        </form>
      )}
    </div>
  );
}
