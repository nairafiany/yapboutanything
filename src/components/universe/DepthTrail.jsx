import { ChevronLeft } from "lucide-react";

export default function DepthTrail({ path, onJump }) {
  if (path.length <= 1) return null;
  return (
    <nav className="depth-trail" aria-label="Current knowledge path">
      <button className="back-button" onClick={() => onJump(path.length - 2)} aria-label="Go back one level"><ChevronLeft size={17} /></button>
      <div className="trail-items">
        {path.slice(1).map((item, index) => (
          <button key={item.id} className={index === path.length - 2 ? "active" : ""} onClick={() => onJump(index + 1)}>
            <i />{item.title.toLowerCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
