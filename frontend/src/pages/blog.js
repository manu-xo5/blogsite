import Input from "../components/Input";
import Select from "../components/Select";
import s from "./blog.module.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import * as React from "react";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Button from "../components/Button";
import { useUser } from "../context/user";

export let category = ["gaming", "music", "informational"];

export default function Blog() {
  let [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  let [message, setMessage] = React.useState("Hello World this is sample");
  let { jwt } = useUser();

  async function handleSubmit(ev) {
    ev.preventDefault();

    let html = stateToHTML(editorState.getCurrentContent());

    let body = new FormData(ev.currentTarget);
    body.set("html", html);
    let res = await fetch("/api/blog/new", {
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
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  return (
    <div>
      {message && <p className={s.message}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className={s.stack}>
          <Input label="title" name="title" />

          <Input label="image" type="file" name="image" />

          <Select label="Category" name="category">
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
    </div>
  );
}
