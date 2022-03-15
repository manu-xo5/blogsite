import s from "./Spinner.module.css";

export default function Spinner({ className }) {
  return (
    <div className={s["lds-spinner"] + " " + className}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
