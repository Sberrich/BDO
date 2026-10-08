import KeystaticApp from "./keystatic";

export default function KeystaticLayout() {
  return (
    <>
      <KeystaticApp />
      <div className="cms-toolbar">
        <a href="/" target="_blank" rel="noopener noreferrer" className="cms-toolbar__link">
          Voir le site ↗
        </a>
        <a href="/api/cms-logout" className="cms-toolbar__link is-out">
          Se déconnecter
        </a>
      </div>
    </>
  );
}
