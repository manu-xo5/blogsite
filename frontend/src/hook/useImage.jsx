import * as React from "react";

function toUrl(file) {
  let url = URL.createObjectURL(file);
  return url;
}

export default function useImage(file, defaultSrc) {
  let [imgUrl, setImgUrl] = React.useState(defaultSrc);

  React.useEffect(() => {
    if (!file) return;

    let url;
    if (file instanceof File) {
      url = toUrl(file);
      setImgUrl(url);
    } else {
      setImgUrl(`data:image;base64,${file}`);
    }

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return imgUrl;
}
