import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowLeft, Check, ChevronRight, Download, Eye, FileText, LayoutDashboard, LogOut, Palette, PanelsTopLeft, Save, Settings2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import { cmsMode, isAdminAuthenticated, savePortfolioContent, signInAdmin, signOutAdmin, uploadResume } from "@/lib/portfolioRepository";
import type { PortfolioContent, PortfolioProject, PortfolioSection } from "@/types/portfolio";

type AdminTab = "dashboard" | "content" | "appearance" | "sections" | "projects" | "resume";

const sectionLabels: Record<PortfolioSection, string> = {
  manifesto: "Manifeste", projects: "Projets", method: "Méthode", expertise: "Expertise", skills: "Compétences",
  experience: "Expériences", education: "Formations", about: "À propos", contact: "Contact",
};

const navItems: { id: AdminTab; label: string; icon: typeof Settings2 }[] = [
  { id: "dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "content", label: "Contenu", icon: PanelsTopLeft },
  { id: "appearance", label: "Apparence", icon: Palette },
  { id: "sections", label: "Sections", icon: Eye },
  { id: "projects", label: "Projets", icon: Settings2 },
  { id: "resume", label: "Curriculum vitæ", icon: FileText },
];

const Admin = () => {
  const { content, setContent, loading } = usePortfolioContent();
  const [draft, setDraft] = useState<PortfolioContent>(content);
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => { setDraft(content); }, [content]);
  useEffect(() => { void isAdminAuthenticated().then(setAuthenticated).finally(() => setCheckingAuth(false)); }, []);

  const visibleCount = useMemo(() => Object.values(draft.sections).filter(Boolean).length, [draft.sections]);
  const publicProjects = useMemo(() => draft.projects.filter((project) => !project.commented), [draft.projects]);

  const update = <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateProject = (id: number, patch: Partial<PortfolioProject>) => setDraft((current) => ({ ...current, projects: current.projects.map((project) => project.id === id ? { ...project, ...patch } : project) }));

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    try { await signInAdmin(email, password); setAuthenticated(true); toast.success("Bienvenue dans votre studio."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Connexion impossible."); }
  };

  const save = async () => {
    setSaving(true);
    try { await savePortfolioContent(draft); setContent(draft); toast.success(cmsMode === "cloud" ? "Portfolio publié." : "Modifications enregistrées sur cet appareil."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "La sauvegarde a échoué."); }
    finally { setSaving(false); }
  };

  const handleResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("Choisissez un fichier PDF.");
    try {
      const url = await uploadResume(file);
      setDraft((current) => ({ ...current, resume: { url, fileName: file.name, updatedAt: new Date().toISOString() } }));
      toast.success("CV chargé. Cliquez sur Publier pour le rendre disponible.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Import impossible."); }
  };

  if (checkingAuth || loading) return <div className="admin-loading"><span />Chargement du studio…</div>;

  if (!authenticated) return (
    <div className="admin-login">
      <div className="admin-login__visual"><span>RG</span><p>Votre portfolio devient un produit vivant.</p></div>
      <form onSubmit={login} className="admin-login__form">
        <p className="admin-kicker">Espace privé</p><h1>Bienvenue dans<br /><em>votre studio.</em></h1>
        <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Mot de passe<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button type="submit">Se connecter <ChevronRight /></button><Link to="/"><ArrowLeft /> Retour au portfolio</Link>
      </form>
    </div>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>RG</span><div><strong>Portfolio Studio</strong><small>{cmsMode === "cloud" ? "Connecté au cloud" : "Mode local"}</small></div></div>
        <nav>{navItems.map((item) => <button className={tab === item.id ? "is-active" : ""} key={item.id} onClick={() => setTab(item.id)}><item.icon />{item.label}</button>)}</nav>
        <div className="admin-sidebar__bottom"><Link to="/" target="_blank"><Eye /> Voir le portfolio</Link>{cmsMode === "cloud" && <button onClick={() => void signOutAdmin().then(() => setAuthenticated(false))}><LogOut /> Déconnexion</button>}</div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar"><div><p>{cmsMode === "cloud" ? "Synchronisation en ligne" : "Prévisualisation locale"}</p><h1>{navItems.find((item) => item.id === tab)?.label}</h1></div><div><Link to="/" target="_blank"><Eye /> Aperçu</Link><button onClick={save} disabled={saving}><Save />{saving ? "Publication…" : "Publier"}</button></div></header>

        <div className="admin-canvas">
          {cmsMode === "local" && <div className="admin-notice"><Settings2 /><div><strong>Le studio fonctionne en mode local.</strong><p>Vos changements sont visibles immédiatement sur cet appareil. Ajoutez les variables Supabase pour publier depuis n’importe où avec une connexion sécurisée.</p></div></div>}

          {tab === "dashboard" && <Dashboard draft={draft} visibleCount={visibleCount} projectCount={publicProjects.length} setTab={setTab} />}
          {tab === "content" && <ContentEditor draft={draft} setDraft={setDraft} />}
          {tab === "appearance" && <AppearanceEditor draft={draft} setDraft={setDraft} />}
          {tab === "sections" && <div className="admin-panel"><PanelTitle title="Organisation des sections" text="Activez ou masquez une partie du portfolio sans supprimer son contenu." /> <div className="admin-section-list">{(Object.keys(draft.sections) as PortfolioSection[]).map((section) => <label key={section}><span><strong>{sectionLabels[section]}</strong><small>{draft.sections[section] ? "Visible sur le site" : "Masquée"}</small></span><input type="checkbox" checked={draft.sections[section]} onChange={(event) => update("sections", { ...draft.sections, [section]: event.target.checked })} /><i /></label>)}</div></div>}
          {tab === "projects" && <ProjectsEditor projects={draft.projects} updateProject={updateProject} />}
          {tab === "resume" && <ResumeEditor draft={draft} onUpload={handleResume} />}
        </div>
      </section>
    </div>
  );
};

const PanelTitle = ({ title, text }: { title: string; text: string }) => <header className="admin-panel-title"><div><p>Édition</p><h2>{title}</h2></div><span>{text}</span></header>;

const Dashboard = ({ draft, visibleCount, projectCount, setTab }: { draft: PortfolioContent; visibleCount: number; projectCount: number; setTab: (tab: AdminTab) => void }) => <>
  <div className="admin-welcome"><div><p>Bonjour Ramatoulaye</p><h2>Votre univers,<br /><em>toujours à jour.</em></h2><span>Modifiez, prévisualisez et publiez sans toucher au code.</span></div><div className="admin-welcome__orb">RG</div></div>
  <div className="admin-metrics"><button onClick={() => setTab("sections")}><span>Sections visibles</span><strong>{visibleCount}<small>/ 9</small></strong><ChevronRight /></button><button onClick={() => setTab("projects")}><span>Projets publiés</span><strong>{projectCount}</strong><ChevronRight /></button><button onClick={() => setTab("resume")}><span>CV en ligne</span><strong className={draft.resume.url ? "is-ready" : ""}>{draft.resume.url ? "Oui" : "Non"}</strong><ChevronRight /></button></div>
  <div className="admin-quick"><PanelTitle title="Actions rapides" text="Les réglages les plus utilisés, accessibles en un geste." /><div><button onClick={() => setTab("content")}><PanelsTopLeft /><span><strong>Modifier l’accueil</strong><small>Hero, manifeste et contact</small></span><ChevronRight /></button><button onClick={() => setTab("appearance")}><Palette /><span><strong>Changer les couleurs</strong><small>Direction visuelle globale</small></span><ChevronRight /></button><button onClick={() => setTab("resume")}><Upload /><span><strong>Mettre à jour le CV</strong><small>Remplacer le PDF public</small></span><ChevronRight /></button></div></div>
</>;

const ContentEditor = ({ draft, setDraft }: { draft: PortfolioContent; setDraft: React.Dispatch<React.SetStateAction<PortfolioContent>> }) => {
  const setNested = (group: "identity" | "hero" | "contact", key: string, value: string) => setDraft((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));
  return <div className="admin-panel"><PanelTitle title="Textes principaux" text="Ces contenus sont immédiatement utilisés dans l’accueil et dans vos appels à l’action." /><div className="admin-form-grid">
    <fieldset><legend>Identité</legend><label>Nom<input value={draft.identity.name} onChange={(event) => setNested("identity", "name", event.target.value)} /></label><label>Métier<input value={draft.identity.role} onChange={(event) => setNested("identity", "role", event.target.value)} /></label><label>Ville<input value={draft.identity.location} onChange={(event) => setNested("identity", "location", event.target.value)} /></label><label>E-mail<input value={draft.identity.email} onChange={(event) => setNested("identity", "email", event.target.value)} /></label><label>GitHub<input value={draft.identity.githubUrl} onChange={(event) => setNested("identity", "githubUrl", event.target.value)} /></label><label>LinkedIn<input value={draft.identity.linkedinUrl} onChange={(event) => setNested("identity", "linkedinUrl", event.target.value)} /></label></fieldset>
    <fieldset><legend>Accueil</legend><label>Disponibilité<input value={draft.hero.availability} onChange={(event) => setNested("hero", "availability", event.target.value)} /></label><label>Surtitre<input value={draft.hero.eyebrow} onChange={(event) => setNested("hero", "eyebrow", event.target.value)} /></label><div className="admin-inline"><label>Ligne 1<input value={draft.hero.titleLine1} onChange={(event) => setNested("hero", "titleLine1", event.target.value)} /></label><label>Ligne 2<input value={draft.hero.titleLine2} onChange={(event) => setNested("hero", "titleLine2", event.target.value)} /></label></div><label>Mot accentué<input value={draft.hero.titleAccent} onChange={(event) => setNested("hero", "titleAccent", event.target.value)} /></label><label>Introduction<textarea rows={4} value={draft.hero.introduction} onChange={(event) => setNested("hero", "introduction", event.target.value)} /></label></fieldset>
    <fieldset className="admin-form-grid__wide"><legend>Manifeste et contact</legend><label>Manifeste<textarea rows={5} value={draft.manifesto} onChange={(event) => setDraft((current) => ({ ...current, manifesto: event.target.value }))} /></label><div className="admin-inline"><label>Titre du contact<input value={draft.contact.title} onChange={(event) => setNested("contact", "title", event.target.value)} /></label><label>Accent<input value={draft.contact.accent} onChange={(event) => setNested("contact", "accent", event.target.value)} /></label></div><label>Introduction du contact<textarea rows={3} value={draft.contact.introduction} onChange={(event) => setNested("contact", "introduction", event.target.value)} /></label></fieldset>
  </div><CollectionsEditor draft={draft} setDraft={setDraft} /></div>;
};

const CollectionsEditor = ({ draft, setDraft }: { draft: PortfolioContent; setDraft: React.Dispatch<React.SetStateAction<PortfolioContent>> }) => {
  const changeList = <K extends "process" | "expertise" | "skillGroups" | "experiences" | "education">(key: K, index: number, patch: Partial<PortfolioContent[K][number]>) => {
    setDraft((current) => ({ ...current, [key]: current[key].map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  };
  const updateAbout = (key: "title" | "accent", value: string) => setDraft((current) => ({ ...current, about: { ...current.about, [key]: value } }));

  return <div className="admin-collections">
    <details><summary><strong>À propos</strong><span>Présentation personnelle</span><ChevronRight /></summary><div className="admin-collection-fields"><label>Titre<input value={draft.about.title} onChange={(event) => updateAbout("title", event.target.value)} /></label><label>Accent<input value={draft.about.accent} onChange={(event) => updateAbout("accent", event.target.value)} /></label>{draft.about.paragraphs.map((paragraph, index) => <label className="admin-collection-fields__wide" key={index}>Paragraphe {index + 1}<textarea rows={3} value={paragraph} onChange={(event) => setDraft((current) => ({ ...current, about: { ...current.about, paragraphs: current.about.paragraphs.map((item, itemIndex) => itemIndex === index ? event.target.value : item) } }))} /></label>)}</div></details>
    <details><summary><strong>Méthode</strong><span>{draft.process.length} étapes</span><ChevronRight /></summary><div className="admin-repeater">{draft.process.map((item, index) => <div key={item.num}><b>{item.num}</b><label>Verbe<input value={item.verb} onChange={(event) => changeList("process", index, { verb: event.target.value })} /></label><label>Titre<input value={item.title} onChange={(event) => changeList("process", index, { title: event.target.value })} /></label><label className="admin-repeater__wide">Description<textarea rows={2} value={item.text} onChange={(event) => changeList("process", index, { text: event.target.value })} /></label></div>)}</div></details>
    <details><summary><strong>Expertise</strong><span>{draft.expertise.length} expertises</span><ChevronRight /></summary><div className="admin-repeater">{draft.expertise.map((item, index) => <div key={item.num}><b>{item.num}</b><label>Titre<input value={item.title} onChange={(event) => changeList("expertise", index, { title: event.target.value })} /></label><label className="admin-repeater__wide">Description<textarea rows={2} value={item.text} onChange={(event) => changeList("expertise", index, { text: event.target.value })} /></label></div>)}</div></details>
    <details><summary><strong>Compétences</strong><span>{draft.skillGroups.length} catégories</span><ChevronRight /></summary><div className="admin-repeater">{draft.skillGroups.map((item, index) => <div key={`${item.title}-${index}`}><b>0{index + 1}</b><label>Catégorie<input value={item.title} onChange={(event) => changeList("skillGroups", index, { title: event.target.value })} /></label><label className="admin-repeater__wide">Compétences, séparées par des virgules<input value={item.items.join(", ")} onChange={(event) => changeList("skillGroups", index, { items: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label></div>)}</div></details>
    <details><summary><strong>Expériences</strong><span>{draft.experiences.length} expériences</span><ChevronRight /></summary><div className="admin-repeater">{draft.experiences.map((item, index) => <div key={`${item.period}-${index}`}><b>0{index + 1}</b><label>Période<input value={item.period} onChange={(event) => changeList("experiences", index, { period: event.target.value })} /></label><label>Poste<input value={item.title} onChange={(event) => changeList("experiences", index, { title: event.target.value })} /></label><label>Entreprise / lieu<input value={item.place} onChange={(event) => changeList("experiences", index, { place: event.target.value })} /></label><label className="admin-repeater__wide">Description<textarea rows={2} value={item.text} onChange={(event) => changeList("experiences", index, { text: event.target.value })} /></label></div>)}</div></details>
    <details><summary><strong>Formations</strong><span>{draft.education.length} formations</span><ChevronRight /></summary><div className="admin-repeater">{draft.education.map((item, index) => <div key={`${item.period}-${index}`}><b>0{index + 1}</b><label>Période<input value={item.period} onChange={(event) => changeList("education", index, { period: event.target.value })} /></label><label>Formation<input value={item.title} onChange={(event) => changeList("education", index, { title: event.target.value })} /></label><label>Établissement<input value={item.place} onChange={(event) => changeList("education", index, { place: event.target.value })} /></label></div>)}</div></details>
  </div>;
};

const AppearanceEditor = ({ draft, setDraft }: { draft: PortfolioContent; setDraft: React.Dispatch<React.SetStateAction<PortfolioContent>> }) => {
  const updateColor = (key: keyof PortfolioContent["appearance"], value: string) => setDraft((current) => ({ ...current, appearance: { ...current.appearance, [key]: value } }));
  return <div className="admin-panel"><PanelTitle title="Direction visuelle" text="Ajustez les couleurs signatures. La prévisualisation se met à jour pendant l’édition." /><div className="admin-color-editor"><label><span>Couleur principale<small>Boutons, titres et détails</small></span><input type="color" value={draft.appearance.accentColor} onChange={(event) => updateColor("accentColor", event.target.value)} /><code>{draft.appearance.accentColor}</code></label><label><span>Couleur lumineuse<small>Accents sur fonds sombres</small></span><input type="color" value={draft.appearance.accentLightColor} onChange={(event) => updateColor("accentLightColor", event.target.value)} /><code>{draft.appearance.accentLightColor}</code></label><div className="admin-palette-preview" style={{ "--preview-primary": draft.appearance.accentColor, "--preview-light": draft.appearance.accentLightColor } as React.CSSProperties}><span>RG</span><div><small>APERÇU DE MARQUE</small><strong>Du besoin au produit <em>livré.</em></strong><button>ACTION PRINCIPALE</button></div></div></div></div>;
};

const ProjectsEditor = ({ projects, updateProject }: { projects: PortfolioProject[]; updateProject: (id: number, patch: Partial<PortfolioProject>) => void }) => <div className="admin-panel"><PanelTitle title="Gestion des projets" text="Modifiez les informations, les médias et choisissez les projets à mettre en avant." /><div className="admin-project-list">{projects.map((project) => <details key={project.id}><summary><div><span className={project.commented ? "is-hidden" : "is-live"}>{project.commented ? "Masqué" : "Publié"}</span><strong>{project.title}</strong><small>{project.technologies.slice(0, 3).join(" · ")}</small></div><ChevronRight /></summary><div className="admin-project-fields"><label>Titre<input value={project.title} onChange={(event) => updateProject(project.id, { title: event.target.value })} /></label><label>Durée<input value={project.duration} onChange={(event) => updateProject(project.id, { duration: event.target.value })} /></label><label className="admin-project-fields__wide">Description<textarea rows={4} value={project.description} onChange={(event) => updateProject(project.id, { description: event.target.value })} /></label><label>URL de démonstration<input value={project.demo || ""} onChange={(event) => updateProject(project.id, { demo: event.target.value })} /></label><label>Technologies (séparées par des virgules)<input value={project.technologies.join(", ")} onChange={(event) => updateProject(project.id, { technologies: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label><label className="admin-project-fields__wide">Images / vidéos (une URL par ligne)<textarea rows={4} value={project.media.map((item) => item.src).join("\n")} onChange={(event) => updateProject(project.id, { media: event.target.value.split("\n").map((src) => src.trim()).filter(Boolean).map((src) => ({ type: src.match(/\.(webm|mp4)$/i) ? "video" : "image", src })) })} /></label><div className="admin-project-toggles"><label><input type="checkbox" checked={!project.commented} onChange={(event) => updateProject(project.id, { commented: !event.target.checked })} /> Visible</label><label><input type="checkbox" checked={Boolean(project.featured)} onChange={(event) => updateProject(project.id, { featured: event.target.checked })} /> À la une</label></div></div></details>)}</div></div>;

const ResumeEditor = ({ draft, onUpload }: { draft: PortfolioContent; onUpload: (event: ChangeEvent<HTMLInputElement>) => void }) => <div className="admin-panel"><PanelTitle title="Curriculum vitæ" text="Le PDF publié alimente automatiquement le bouton Télécharger mon CV sur votre portfolio." /><div className="admin-resume"><div className="admin-resume__drop"><FileText /><h3>{draft.resume.fileName || "Ajoutez votre CV"}</h3><p>Un fichier PDF, clair et optimisé pour les recruteurs.</p><label><Upload /> Choisir un PDF<input type="file" accept="application/pdf" onChange={onUpload} /></label>{draft.resume.url && <a href={draft.resume.url} target="_blank" rel="noreferrer"><Download /> Vérifier le document</a>}</div><aside><p>Conseils pour votre nouveau CV</p><ul><li><Check /> Un titre métier précis</li><li><Check /> Des résultats mesurables</li><li><Check /> Une page, deux maximum</li><li><Check /> Une version compatible ATS</li></ul><span>Envoyez-moi votre CV actuel et je pourrai le réécrire et le redessiner avec vous.</span></aside></div></div>;

export default Admin;
