import Script from "next/script";

export const metadata = { title: "Education platform engineer · Fernhill Learning" };

// The demo: a plain application form for the fictional employer, with the one line pasted in.
// Submitting sends the form to /verify, so you see the voit-result value as the employer receives it.
export default function ApplyPage() {
  return (
    <main className="page">
      <form className="host" action="/verify" method="get">
        <h1>Education platform engineer</h1>
        <p className="sub">Fernhill Learning · Remote · Full time</p>
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" type="text" autoComplete="name" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" />
        <label htmlFor="resume">Résumé</label>
        <input id="resume" type="file" />
        <label htmlFor="cover">Cover letter</label>
        <textarea id="cover" rows={5} />
        <div className="slot">
          <voit-challenge pack="education-platform-engineer"></voit-challenge>
        </div>
        <button className="submit">Submit application</button>
      </form>
      <Script src="/embed.js" />
    </main>
  );
}
