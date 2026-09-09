import Image from "next/image";
import { mediaPreviewPath } from "@/features/media/admin";

type ClientItem = {
  id: string;
  name: string;
  client: {
    lightLogo: { id: string; storageKey: string; isPublic: boolean; status: string } | null;
    darkLogo: { id: string; storageKey: string; isPublic: boolean; status: string } | null;
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
            {renderClientMark(client)}
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}

function renderClientMark(client: ClientItem) {
  const eligible = (media: ClientItem["client"]["lightLogo"]) => media?.isPublic && media.status === "ACTIVE" ? media : null;
  const light = eligible(client.client.lightLogo) ?? eligible(client.client.darkLogo);
  const dark = eligible(client.client.darkLogo) ?? eligible(client.client.lightLogo);
  const lightSrc = light ? mediaPreviewPath(light.id, light.storageKey) : null;
  const darkSrc = dark ? mediaPreviewPath(dark.id, dark.storageKey) : null;
  if (!lightSrc || !darkSrc) return <span>{client.name}</span>;
  return <><Image className="client-logo client-logo-light" src={lightSrc} alt={client.name} width={180} height={64} unoptimized/><Image className="client-logo client-logo-dark" src={darkSrc} alt={client.name} width={180} height={64} unoptimized/></>;
}
