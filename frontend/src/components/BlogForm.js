import * as React from "react";
import s from "./BlogForm.module.css";
import {
  Stack,
  TextField as Input,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import SpinIcon from "./SpinIcon";
import { UploadIcon } from "@heroicons/react/outline";
import { Editor } from "react-draft-wysiwyg";
import { category } from "../pages/blog";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function BlogForm({
  handleSubmit,
  defaults,
  shouldUpdate,
  editorState,
  setEditorState,
  onFileChange,
}) {
  let [isSaving, setIsSaving] = React.useState(false);
  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        setIsSaving(true);
        await handleSubmit(ev);
        setIsSaving(false);
      }}
    >
      <Stack spacing={3}>
        <Input
          fullWidth
          label="title"
          name="title"
          defaultValue={defaults.title}
        />

        <div>
          <p>Image Preview</p>

          <input
            type="file"
            name="image"
            onChange={(ev) => onFileChange(ev.currentTarget.files[0])}
            id="new-blog-form-image"
            hidden
          />

          <Box
            sx={{
              mt: "1rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "2rem",
            }}
          >
            <img className={s.image} src={defaults.image} alt="&times;" />

            <Button
              htmlFor="new-blog-form-image"
              component="label"
              variant="outlined"
            >
              Choose Image
            </Button>
          </Box>
        </div>

        <FormControl fullWidth>
          <InputLabel id="new-blog-form-category">Category</InputLabel>
          <Select
            name="category"
            labelId="new-blog-form-category"
            label="Category"
            defaultValue={defaults.category}
          >
            {category.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div>
          <p>Content</p>
          <Editor
            editorState={editorState}
            toolbarClassName={s.editorToolbar}
            wrapperClassName={s.editorWrapper}
            editorClassName={s.editor}
            onEditorStateChange={setEditorState}
          />
        </div>

        <div>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={
              isSaving ? (
                <SpinIcon style={{ height: "1.2em" }} />
              ) : (
                <UploadIcon style={{ height: "1.2em" }} />
              )
            }
          >
            {shouldUpdate ? "Update" : "Save"}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
