import Script from "next/script";
import { Mark } from "../ui";

export const metadata = { title: "Practice · Voit Proof" };

export default function PracticePage() {
  return (
    <main className="page" style={{ maxWidth: 688 }}>
      <Mark />
      <div className="page-head">
        <h1>Practice.</h1>
        <p>Every call in the pack, with the reason after each one. About ten minutes. Nothing here goes to an employer.</p>
      </div>
      <voit-challenge pack="education-platform-engineer" mode="practice"></voit-challenge>
      <Script src="/embed.js" />
    </main>
  );
}
