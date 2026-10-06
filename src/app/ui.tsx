import { ARROW, SEAL } from "@/embed/marks";
import { profileHtml, type Profile } from "@/embed/html";

// The few shared pieces of the pages, drawn from the same marks and HTML builders as the player.

export function Seal({ big = false }: { big?: boolean }) {
  return <span className={big ? "seal big" : "seal"} dangerouslySetInnerHTML={{ __html: SEAL }} />;
}

export function Arrow() {
  return <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: ARROW }} />;
}

export function Mark() {
  return (
    <a className="mark-sm" href="/">
      <Seal />
      Voit Proof
    </a>
  );
}

export function ProfileRows({ profile }: { profile: Profile }) {
  return <div dangerouslySetInnerHTML={{ __html: profileHtml(profile) }} />;
}
