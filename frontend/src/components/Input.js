import s from "./Input.module.css";

export default function Input({ label, ...inputProps }) {
  return (
    <label className={s.container}>
      <span className={s.label}> {label}</span>
      <input className={s.input} {...inputProps} />
    </label>
  );
}
