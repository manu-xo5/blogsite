import * as React from "react";
import s from "./BlogCard.module.css";
import { Link } from "react-router-dom";

import { PencilIcon } from "@heroicons/react/outline";

export function BlogCard({
  showEdit = true,
  imgSrc,
  title,
  category,
  _id,
  html,
}) {
  return (
    <article className={s.container}>
      {showEdit && (
        <Link to={`/blog/update/${_id}`}>
          <PencilIcon className={s.pencil} />
        </Link>
      )}

      <img src={imgSrc} alt={title} className={s.image} />

      <p>{title}</p>
      <p>category: {category}</p>
      <div
        dangerouslySetInnerHTML={{ __html: html.substring(0, 60) + "..." }}
      />

      <Link to={`/blog/read/${_id}`}>Read More &rarr;</Link>
    </article>
  );
}
