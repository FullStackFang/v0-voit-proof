// Entry for public/embed.js: framework-free, no React. Defines <voit-challenge>.
import { VoitChallenge } from "./player";

if (!customElements.get("voit-challenge")) customElements.define("voit-challenge", VoitChallenge);
