export default function Footer() {
  return (
    <footer className="px-6 py-4 text-center text-copy">
      <span className="font-semibold text-menu">Copyright © 2024–{new Date().getFullYear()} </span>
      <a href="http://logicslabs.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
        LogicsLabs.
      </a>
      <span className="font-semibold text-menu"> All rights reserved.</span>
    </footer>
  );
}