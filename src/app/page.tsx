import { Mark } from "./ui";

export default function Home() {
  return (
    <main className="page">
      <Mark />
      <ul className="links">
        <li>
          <a href="/apply">
            <b>/apply</b>
            <span>Apply as a candidate, with the challenge in the form</span>
          </a>
        </li>
        <li>
          <a href="/practice">
            <b>/practice</b>
            <span>Every item, with the reasons</span>
          </a>
        </li>
        <li>
          <a href="/verify">
            <b>/verify</b>
            <span>Check one result</span>
          </a>
        </li>
        <li>
          <a href="/pool">
            <b>/pool</b>
            <span>Order a pool of results</span>
          </a>
        </li>
      </ul>
    </main>
  );
}
