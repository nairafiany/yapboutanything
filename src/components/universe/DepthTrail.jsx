import { ChevronLeft } from "lucide-react";

export default function DepthTrail({ path, onJump }) {
  if (path.length <= 1) return null;
  return (
    <nav className="depth-trail" aria-label="Current knowledge path">
      <button className="back-button" onClick={() => onJump(path.length - 2)} aria-label="Go back one level"><ChevronLeft size={17} /></button>
      <div className="trail-items">
        {path.slice(-2).filter(item => item.id !== "root").map((item) => (
          <button key={item.id} className={item.id === path.at(-1).id ? "active" : ""} onClick={() => onJump(path.findIndex(entry => entry.id === item.id))}>
            <i />{item.title.toLowerCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
