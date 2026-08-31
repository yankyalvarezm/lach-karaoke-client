import "./App.css";

const HARMONIA_PLANS_URL = "https://www.harmoniasistem.com/#planes";

function App() {
  return (
    <main className="harmonia-deactivated-page">
      <section className="harmonia-shell" aria-labelledby="deactivated-title">
        <div className="harmonia-brand">
          <div className="harmonia-mark" aria-hidden="true">
            <span />
          </div>
          <p>Harmonia Sistem</p>
        </div>

        <div className="harmonia-content">
          <p className="harmonia-kicker">Lach Karaoke</p>
          <h1 id="deactivated-title">
            <span>Página</span>
            <span>desactivada</span>
          </h1>
          <p className="harmonia-message">
            Esta página ha sido desactivada. Lach-karaoke-sistem ahora funciona
            bajo Harmonia. Para mantener tu usuario activo y seguir usando el
            servicio, entra a los planes de Harmonia y compra una suscripción.
          </p>

          <div className="harmonia-actions" aria-label="Acciones disponibles">
            <a href={HARMONIA_PLANS_URL} className="harmonia-btn harmonia-btn-primary">
              Ir a Harmonia
            </a>
            <a href={HARMONIA_PLANS_URL} className="harmonia-btn harmonia-btn-secondary">
              Comprar una suscripción
            </a>
          </div>
        </div>

        <aside className="harmonia-info" aria-label="Información de migración">
          <p className="harmonia-info-label">Nuevo acceso</p>
          <p>harmoniasistem.com</p>
          <span>Planes y suscripciones disponibles</span>
        </aside>
      </section>
    </main>
  );
}

export default App;
