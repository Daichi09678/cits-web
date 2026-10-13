export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hexagon */}
      <div
        className="absolute top-20 right-[10%] w-24 h-24 border border-brand/20 animate-float-hex"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      />

      {/* Circuit nodes */}
      <div
        className="absolute top-[40%] left-[5%] w-3 h-3 rounded-full bg-brand/30 animate-pulse-node-1"
      />
      <div
        className="absolute top-[60%] right-[8%] w-2 h-2 rounded-full bg-brand/20 animate-pulse-node-2"
      />

      {/* Floating squares */}
      <div
        className="absolute bottom-[20%] left-[15%] w-16 h-16 border border-brand/10 rounded-lg animate-rotate-square"
      />

      {/* Dashed circle */}
      <div
        className="absolute bottom-[30%] right-[25%] w-20 h-20 rounded-full border border-dashed border-brand/15 animate-rotate-dashed"
      />
    </div>
  );
}
