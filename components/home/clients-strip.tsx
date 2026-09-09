type ClientItem = {
  id: string;
  name: string;
  client: {
    lightLogo: { storageKey: string; isPublic: boolean; status: string } | null;
    darkLogo: { storageKey: string; isPublic: boolean; status: string } | null;
  };
};

export function ClientsStrip({ clients, title }: { clients: ClientItem[]; title: string }) {
  if (clients.length === 0) return null;
  const repeated = clients.length > 3 ? [...clients, ...clients] : clients;
  return <section className="clients-strip" aria-labelledby="clients-strip-title">
    <div className="site-container clients-strip-inner">
      <div className="clients-strip-heading"><p id="clients-strip-title">{title}</p><span aria-hidden="true">←</span></div>
      <div className="clients-marquee" role="region" aria-label={title}>
        <div className="clients-track">
          {repeated.map((client, index) => <div className="client-mark" key={`${client.id}-${index}`} aria-hidden={index >= clients.length}>
            <span>{client.name}</span>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
