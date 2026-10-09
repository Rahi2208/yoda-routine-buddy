// YODA's body, drawn with CSS only (placeholder design, see decision D9).
// mood: "idle" | "happy" | "talking" | "alert"
import "./Pet.css";

export default function Pet({ mood = "idle", size = 120, className = "" }) {
  return (
    <div className={`pet pet--${mood} ${className}`} style={{ "--pet-size": `${size}px` }} aria-hidden="true">
      <div className="pet__sprout" />
      <div className="pet__body">
        <div className="pet__eye pet__eye--left" />
        <div className="pet__eye pet__eye--right" />
        <div className="pet__cheek pet__cheek--left" />
        <div className="pet__cheek pet__cheek--right" />
        <div className="pet__mouth" />
      </div>
      <div className="pet__feet">
        <span />
        <span />
      </div>
    </div>
  );
}
