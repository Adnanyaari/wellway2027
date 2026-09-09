import Image from "next/image";
import { NoImage } from "@/components/media/no-image";
import type { PublishedProject } from "@/features/projects/public";
import { localizedPath, type Locale } from "@/lib/i18n/config";

type Labels = {
  eyebrow: string;
  title: string;
  viewAll: string;
  noImage: string;
  empty: string;
};

export function SelectedWork({ projects, locale, labels }: {
  projects: PublishedProject[];
  locale: Locale;
  labels: Labels;
}) {
  return <section className="selected-work" aria-labelledby="selected-work-title">
    <div className="site-container">
      <header className="selected-work-heading">
        <div>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h2 id="selected-work-title">{labels.title}</h2>
        </div>
        <a className="selected-work-link" href={localizedPath(locale, "/projects")}>
          {labels.viewAll}<Arrow/>
        </a>
      </header>

      {projects.length > 0 ? <div className="selected-work-grid">
        {projects.map((project, index) => <article className="project-showcase-card" key={project.id}>
          <div className="project-showcase-media">
            {project.image
              ? <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 760px) 100vw, 50vw"/>
              : <NoImage label={labels.noImage}/>} 
            <span className="project-showcase-index">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="project-showcase-copy">
            <p>{project.clientName}</p>
            <h3>{project.title}</h3>
            {project.summary && <p className="project-showcase-summary">{project.summary}</p>}
            {project.services.length > 0 && <ul aria-label={locale === "ar" ? "الخدمات" : "Services"}>
              {project.services.map(service => <li key={service}>{service}</li>)}
            </ul>}
          </div>
        </article>)}
      </div> : <div className="selected-work-empty">
        <NoImage label={labels.noImage}/>
        <p>{labels.empty}</p>
      </div>}
    </div>
  </section>;
}

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>;
}
