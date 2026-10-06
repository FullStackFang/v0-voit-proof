import { Mark } from "../ui";
import { RankedPool } from "./ranked-pool";

export const metadata = { title: "Ranked pool · Voit Proof" };

export default function PoolPage() {
  return (
    <main className="page">
      <Mark />
      <div className="page-head">
        <h1>Order the pool.</h1>
        <p>Paste the voit-result value from each application, one per line, with a name or label in front. Genuine results are ordered by their scored calls. Nobody is removed, and nothing is stored.</p>
      </div>
      <RankedPool />
    </main>
  );
}
