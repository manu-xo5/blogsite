import s from "./Select.module.css";

export default function Select({ label, children, ...props }) {
  return (
    <label className={s.container}>
      <span className={s.label}>{label}</span>

      <select className={s.select} {...props}>
        {children}
      </select>
    </label>
  );
}
