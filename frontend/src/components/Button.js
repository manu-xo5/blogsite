import s from "./Button.module.css";

export default function Button({ className, variant, ...props }) {
  return (
    <button
      type="button"
      className={s.base + " " + className + " " + s[variant]}
      {...props}
    />
  );
}
