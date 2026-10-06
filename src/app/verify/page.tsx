import { Mark } from "../ui";
import { Verify } from "./verify";

export const metadata = { title: "Verify a result · Voit Proof" };

// The demo application form submits here, so a submitted token arrives as ?voit-result=
export default async function VerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const given = (await searchParams)["voit-result"];
  return (
    <main className="page">
      <Mark />
      <div className="page-head">
        <h1>Verify a result.</h1>
        <p>Paste the voit-result value from an application. It is checked against the public key, in your browser.</p>
      </div>
      <Verify initial={typeof given === "string" ? given : ""} />
    </main>
  );
}
