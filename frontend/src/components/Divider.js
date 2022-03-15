import s from "./Divider.module.css";

export default function Divider({ children, className }) {
  return (
    <p className={className + " " + s.divider}>
      <span className={s.line}></span>

      {children}

      <span className={s.line}></span>
    </p>
  );
}
