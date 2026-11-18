/** Marco HUD: esquinas y lecturas en vivo (se actualizan por DOM, sin re-render). */
export default function Hud() {
  return (
    <div className="hud" aria-hidden="true">
      <i className="hud__corner hud__corner--tl" />
      <i className="hud__corner hud__corner--tr" />
      <i className="hud__corner hud__corner--bl" />
      <i className="hud__corner hud__corner--br" />

      <div className="hud__block hud__block--tl">
        <span>Sujeto</span>
        <b>K-A-R-L-A</b>
      </div>
      <div className="hud__block hud__block--tr">
        <span>Sincronía</span>
        <b data-sync>000%</b>
        <span data-frame>FR 001/150</span>
      </div>
      <div className="hud__ruler"><i data-ruler /></div>
    </div>
  );
}
