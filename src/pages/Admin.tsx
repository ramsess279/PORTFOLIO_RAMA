import recoverySource from "@/assets/cv-original-recovery.pdf?url";
import { insertResumeExperience } from "@/lib/insertResumeExperience";
import { formatPortfolioExperience } from "@/lib/resumeExperienceContent";
import { loadResumeDraft, saveResumeDraft } from "@/lib/resumeDraftStorage";
import { ResumePdfEditor } from "@/components/ResumePdfEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { PdfResume } from "@/components/PdfResume";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ChevronLeft, ChevronRight, Download, Eye, EyeOff, FileText, LayoutDashboard, LockKeyhole, LogOut, Palette, PanelsTopLeft, Plus, Save, Settings2, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import { cmsMode, getAdminAuthState, savePortfolioContent, setupLocalAdminPassword, signInAdmin, signOutAdmin, uploadResume } from "@/lib/portfolioRepository";
import { importResumePdf, type ResumeImport } from "@/lib/resumeImport";
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
  const [authMode, setAuthMode] = useState<"setup" | "login">("login");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resumeImport, setResumeImport] = useState<ResumeImport | null>(null);
  const [importingResume, setImportingResume] = useState(false);

  const [draftReady, setDraftReady] = useState(false);
  const [resumeStorageStatus, setResumeStorageStatus] = useState("");
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    setDraftReady(false);
    void loadResumeDraft().then((resume) => {
      if (!cancelled) setDraft({ ...content, resume: resume ?? content.resume });
    }).catch(() => {
      if (!cancelled) {
        setDraft(content);
        setResumeStorageStatus("La sauvegarde locale est inaccessible. Téléchargez une copie de votre CV.");
      }
    }).finally(() => { if (!cancelled) setDraftReady(true); });
    return () => { cancelled = true; };
  }, [content, loading]);
  useEffect(() => {
    if (!draftReady || loading || !draft.resume.url) return;
    let cancelled = false;
    setResumeStorageStatus("Enregistrement du CV sur cet appareil…");
    void saveResumeDraft(draft.resume).then(() => {
      if (!cancelled) setResumeStorageStatus("CV sauvegardé sur cet appareil, même après fermeture du navigateur. Pensez à télécharger une copie.");
    }).catch(() => {
      if (!cancelled) {
        setResumeStorageStatus("Échec de la sauvegarde du CV. Téléchargez une copie avant de fermer.");
        toast.error("La sauvegarde du CV a échoué. Téléchargez votre PDF pour le conserver.");
      }
    });
    return () => { cancelled = true; };
  }, [draft.resume, draftReady, loading]);
  useEffect(() => { void getAdminAuthState().then((state) => { setAuthenticated(state === "authenticated"); if (state !== "authenticated") setAuthMode(state); }).finally(() => setCheckingAuth(false)); }, []);

  const visibleCount = useMemo(() => Object.values(draft.sections).filter(Boolean).length, [draft.sections]);
  const publicProjects = useMemo(() => draft.projects.filter((project) => !project.commented), [draft.projects]);
  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    return [password.length >= 8, password.length >= 12, /[A-Z]/.test(password) && /[a-z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  }, [password]);

  const update = <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateProject = (id: number, patch: Partial<PortfolioProject>) => setDraft((current) => ({ ...current, projects: current.projects.map((project) => project.id === id ? { ...project, ...patch } : project) }));

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (authMode === "setup") {
        if (password !== passwordConfirmation) throw new Error("Les deux mots de passe ne correspondent pas.");
        await setupLocalAdminPassword(password);
      } else await signInAdmin(email, password);
      setAuthenticated(true); toast.success(authMode === "setup" ? "Votre espace privé est protégé." : "Bienvenue dans votre studio.");
    }
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
    setImportingResume(true);
    try { const url = await uploadResume(file); const resume: PortfolioContent["resume"] = { url, fileName: file.name, updatedAt: new Date().toISOString(), mode: "imported" }; await saveResumeDraft(resume); setDraft((current) => ({ ...current, resume })); toast.success("CV importé avec sa mise en page et toutes ses pages. Publiez pour le rendre public."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Import impossible."); }
    finally { setImportingResume(false); event.target.value = ""; }
  };

  const recoverResume = async () => {
    setImportingResume(true);
    try {
      const experience = draft.experiences.find((item) => /digital media mobile/i.test(item.place));
      if (!experience) throw new Error("L’expérience DMM est introuvable dans le portfolio.");
      const response = await fetch(recoverySource);
      if (!response.ok) throw new Error("La copie originale du CV est inaccessible.");
      const bytes = await insertResumeExperience(await response.arrayBuffer(), formatPortfolioExperience(experience), draft);
      const url = await uploadResume(new File([new Uint8Array(bytes.bytes)], "CV_RAMA-restaure.pdf", { type: "application/pdf" }));
      const resume = { url, fileName: "CV_RAMA-restaure.pdf", updatedAt: new Date().toISOString(), mode: "imported" as const };
      await saveResumeDraft(resume);
      setDraft((current) => ({ ...current, resume }));
      toast.success("CV reconstruit et sauvegardé sur cet appareil.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Restauration impossible."); }
    finally { setImportingResume(false); }
  };

  const applyResumeImport = async () => {
    if (!resumeImport) return;
    setImportingResume(true);
    try {
      const url = await uploadResume(resumeImport.file);
      setDraft((current) => ({ ...current, identity: { ...current.identity, ...resumeImport.identity }, cv: { ...current.cv, ...resumeImport.cv }, resume: { url, fileName: resumeImport.file.name, updatedAt: new Date().toISOString() } }));
      setResumeImport(null); toast.success("Données importées. Vérifiez maintenant chaque étape puis publiez.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Import impossible."); }
    finally { setImportingResume(false); }
  };

  if (checkingAuth || loading || !draftReady) return <div className="admin-loading"><span />Chargement du studio…</div>;

  if (!authenticated) return (
    <div className="admin-login">
      <div className="admin-login__visual"><span>RG</span><p>Votre portfolio devient un produit vivant.</p></div>
      <form onSubmit={login} className="admin-login__form">
        <p className="admin-kicker">{authMode === "setup" ? "Première ouverture" : "Espace privé"}</p><h1>{authMode === "setup" ? <>Créez votre<br /><em>mot de passe.</em></> : <>Bienvenue dans<br /><em>votre studio.</em></>}</h1>
        {cmsMode === "cloud" && <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>}
        <label>Mot de passe<div className="admin-password-field"><LockKeyhole /><input type={showPassword ? "text" : "password"} minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={authMode === "setup" ? "new-password" : "current-password"} required /><button type="button" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
        {authMode === "setup" && <><label>Confirmer le mot de passe<div className={`admin-password-field ${passwordConfirmation && password === passwordConfirmation ? "is-valid" : ""}`}><LockKeyhole /><input type={showPassword ? "text" : "password"} minLength={8} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} autoComplete="new-password" required />{passwordConfirmation && password === passwordConfirmation && <Check />}</div></label><div className="password-strength" aria-live="polite"><div>{[1, 2, 3, 4, 5].map((level) => <i className={passwordStrength >= level ? "is-active" : ""} key={level} />)}</div><span>{passwordStrength < 2 ? "Faible" : passwordStrength < 4 ? "Correct" : "Très sécurisé"}</span></div></>}
        <button type="submit">{authMode === "setup" ? "Protéger mon studio" : "Se connecter"} <ChevronRight /></button><Link to="/"><ArrowLeft /> Retour au portfolio</Link>
      </form>
    </div>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>RG</span><div><strong>Portfolio Studio</strong><small>{cmsMode === "cloud" ? "Connecté au cloud" : "Mode local"}</small></div></div>
        <nav>{navItems.map((item) => <button className={tab === item.id ? "is-active" : ""} key={item.id} onClick={() => setTab(item.id)}><item.icon />{item.label}</button>)}</nav>
        <div className="admin-sidebar__bottom"><Link to="/" target="_blank"><Eye /> Voir le portfolio</Link><button onClick={() => void signOutAdmin().then(() => { setAuthenticated(false); setAuthMode("login"); })}><LogOut /> Déconnexion</button></div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar"><div><p className={isDirty ? "has-unsaved" : ""}>{isDirty ? "Modifications non publiées" : cmsMode === "cloud" ? "Synchronisation en ligne" : "Portfolio à jour"}</p><h1>{navItems.find((item) => item.id === tab)?.label}</h1></div><div><Link to="/" target="_blank"><Eye /> Aperçu</Link><button className={isDirty ? "needs-save" : ""} onClick={save} disabled={saving}><Save />{saving ? "Publication…" : isDirty ? "Publier les changements" : "Publié"}</button></div></header>

        <div className="admin-canvas">
          {cmsMode === "local" && <div className="admin-notice"><Settings2 /><div><strong>Le studio fonctionne en mode local.</strong><p>Le PDF du CV est sauvegardé automatiquement dans ce navigateur après application des retouches. Publiez les changements pour mettre à jour le portfolio visible. Téléchargez aussi une copie de votre CV.</p></div></div>}

          {tab === "dashboard" && <Dashboard draft={draft} visibleCount={visibleCount} projectCount={publicProjects.length} setTab={setTab} />}
          {tab === "content" && <ContentEditor draft={draft} setDraft={setDraft} />}
          {tab === "appearance" && <AppearanceEditor draft={draft} setDraft={setDraft} />}
          {tab === "sections" && <div className="admin-panel"><PanelTitle title="Organisation des sections" text="Activez ou masquez une partie du portfolio sans supprimer son contenu." /> <div className="admin-section-list">{(Object.keys(draft.sections) as PortfolioSection[]).map((section) => <label key={section}><span><strong>{sectionLabels[section]}</strong><small>{draft.sections[section] ? "Visible sur le site" : "Masquée"}</small></span><input type="checkbox" checked={draft.sections[section]} onChange={(event) => update("sections", { ...draft.sections, [section]: event.target.checked })} /><i /></label>)}</div></div>}
          {tab === "projects" && <ProjectsEditor projects={draft.projects} updateProject={updateProject} />}
          {tab === "resume" && !draft.resume.url && <div className="admin-notice"><FileText /><div><strong>Une copie originale de votre CV a été retrouvée.</strong><p>Reconstruisez le PDF avec DMM, les compétences et les formations du portfolio. Les anciennes retouches manuelles absentes de cette copie ne peuvent pas être récupérées automatiquement.</p><button type="button" className="admin-primary" disabled={importingResume} onClick={() => void recoverResume()}>{importingResume ? "Reconstruction en cours…" : "Restaurer mon CV et ses mises à jour"}</button></div></div>}
          {tab === "resume" && resumeStorageStatus && <p role="status">{resumeStorageStatus}</p>}
          {tab === "resume" && <ResumeEditor draft={draft} setDraft={setDraft} onUpload={handleResume} resumeImport={resumeImport} importing={importingResume} onApplyImport={applyResumeImport} onCancelImport={() => setResumeImport(null)} />}
        </div>
      </section>
    </div>
  );
};

const PanelTitle = ({ title, text }: { title: string; text: string }) => <header className="admin-panel-title"><div><p>Édition</p><h2>{title}</h2></div><span>{text}</span></header>;

const Dashboard = ({ draft, visibleCount, projectCount, setTab }: { draft: PortfolioContent; visibleCount: number; projectCount: number; setTab: (tab: AdminTab) => void }) => <>
  <div className="admin-welcome"><div><p>Bonjour Ramatoulaye</p><h2>Votre univers,<br /><em>toujours à jour.</em></h2><span>Modifiez, prévisualisez et publiez sans toucher au code.</span></div><div className="admin-welcome__orb">RG</div></div>
  <div className="admin-metrics"><button onClick={() => setTab("sections")}><span>Sections visibles</span><strong>{visibleCount}<small>/ 9</small></strong><ChevronRight /></button><button onClick={() => setTab("projects")}><span>Projets publiés</span><strong>{projectCount}</strong><ChevronRight /></button><button onClick={() => setTab("resume")}><span>CV dynamique</span><strong className="is-ready">Prêt</strong><ChevronRight /></button></div>
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

const ResumeEditor = ({ draft, setDraft, onUpload, resumeImport, importing, onApplyImport, onCancelImport }: { draft: PortfolioContent; setDraft: React.Dispatch<React.SetStateAction<PortfolioContent>>; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; resumeImport: ResumeImport | null; importing: boolean; onApplyImport: () => void; onCancelImport: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = ["Identité", "Profil", "Expériences", "Formations", "Projets", "Stack", "Aperçu"];
  const setCv = (key: keyof PortfolioContent["cv"], value: PortfolioContent["cv"][typeof key]) => setDraft((current) => ({ ...current, cv: { ...current.cv, [key]: value } }));
  const setIdentity = (key: keyof PortfolioContent["identity"], value: string) => setDraft((current) => ({ ...current, identity: { ...current.identity, [key]: value } }));
  const updateCvExperience = (index: number, patch: Partial<PortfolioContent["cv"]["experiences"][number]>) => setCv("experiences", draft.cv.experiences.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const updateCvEducation = (index: number, patch: Partial<PortfolioContent["cv"]["education"][number]>) => setCv("education", draft.cv.education.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const moveExperience = (index: number, direction: -1 | 1) => { const next = [...draft.cv.experiences]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setCv("experiences", next); };
  const moveEducation = (index: number, direction: -1 | 1) => { const next = [...draft.cv.education]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setCv("education", next); };
  const toggleCvProject = (id: number) => setCv("selectedProjectIds", draft.cv.selectedProjectIds.includes(id) ? draft.cv.selectedProjectIds.filter((projectId) => projectId !== id) : [...draft.cv.selectedProjectIds, id]);
  const updateProjectSummary = (id: number, cvSummary: string) => setDraft((current) => ({ ...current, projects: current.projects.map((project) => project.id === id ? { ...project, cvSummary } : project) }));

  if (draft.resume.mode === "imported" && draft.resume.url) return <div className="admin-panel cv-imported-workspace">
    <PanelTitle title="Mon CV importé" text="Retouchez votre document, vérifiez le résultat puis publiez-le." />
    <div className="cv-document-bar"><div><FileText /><span><strong>{draft.resume.fileName}</strong><small>Document actif · Votre design et toutes vos pages</small></span></div><a className="cv-download-button" href={draft.resume.url} download={draft.resume.fileName || "CV_Ramatoulaye_Gueye.pdf"}><Download /> Télécharger le CV (PDF)</a><label className="cv-replace"><Upload /> {importing ? "Importation…" : "Remplacer le PDF"}<input type="file" accept="application/pdf" disabled={importing} onChange={onUpload} /></label></div>
    <ol className="cv-workflow"><li><b>1</b><span><strong>Retoucher</strong>Choisissez une page et placez votre texte.</span></li><li><b>2</b><span><strong>Appliquer</strong>Enregistrez les retouches dans le PDF.</span></li><li><b>3</b><span><strong>Publier</strong>Utilisez « Publier les changements » en haut.</span></li></ol>
    <div className="cv-publish-help"><strong>Comment publier ce CV ?</strong><p>1. Enregistrez les retouches en attente dans l’éditeur. 2. Téléchargez ou ouvrez le PDF pour le vérifier. 3. Cliquez sur « Publier les changements » en haut à droite. Le lien « Voir mon CV » du portfolio utilisera alors ce document.</p><p>{cmsMode === "local" ? "Vous êtes en mode local : la publication concerne ce navigateur uniquement. Pour vos visiteurs en ligne, il faut connecter le CMS cloud (Supabase) et déployer le site avec cette configuration." : "Vous êtes connecté au CMS cloud : après publication, le PDF sera disponible aux visiteurs du site connecté au même CMS."}</p></div>
    <ResumePdfEditor key={draft.resume.url} content={draft} resume={draft.resume} onSave={(resume) => setDraft((current) => ({ ...current, resume }))} />
    <div className="cv-document-footer"><a className="cv-download-button" href={draft.resume.url} download={draft.resume.fileName || "CV_Ramatoulaye_Gueye.pdf"}><Download /> Télécharger le CV (PDF)</a><Link to="/cv?preview=1" onClick={() => sessionStorage.setItem("rg-cv-preview", JSON.stringify(draft))} target="_blank"><Eye /> Vérifier / télécharger le PDF enregistré</Link><details><summary>Utiliser le modèle du portfolio</summary><p>Ce modèle possède ses propres champs. Votre PDF importé reste conservé.</p><button type="button" onClick={() => setDraft((current) => ({ ...current, resume: { ...current.resume, mode: "generated" } }))}>Passer au modèle du portfolio</button></details></div>
  </div>;

  return <div className="admin-panel"><PanelTitle title="CV Builder" text="Conservez le design de votre PDF ou créez un CV avec le modèle du portfolio." />
    <section className="cv-import-card"><div><Upload /><span><strong>Partir de mon CV actuel</strong><small>Votre mise en page, vos polices et toutes vos pages sont conservées. Les champs du modèle restent indépendants.</small></span></div><label>{importing ? "Analyse en cours…" : "Choisir un PDF"}<input type="file" accept="application/pdf" disabled={importing} onChange={onUpload} /></label></section>
    {resumeImport && <section className="cv-import-review"><header><div><strong>{resumeImport.file.name}</strong><span>{resumeImport.detected.length ? `Détecté : ${resumeImport.detected.join(" · ")}` : "Aucune donnée structurée reconnue automatiquement"}</span></div></header><p>{resumeImport.text.slice(0, 420)}{resumeImport.text.length > 420 ? "…" : ""}</p><small>Après application, parcourez les 7 étapes : l’extraction aide à préremplir le CV mais vous gardez toujours le contrôle.</small><div><button type="button" onClick={onCancelImport}>Annuler</button><button type="button" onClick={onApplyImport} disabled={importing}><Check /> Appliquer et vérifier étape par étape</button></div></section>}
    <div className="cv-mode-switch"><button type="button" onClick={() => setDraft((current) => ({ ...current, resume: { ...current.resume, mode: "generated" } }))}>Modèle du portfolio</button><button type="button" disabled={!draft.resume.url} onClick={() => setDraft((current) => ({ ...current, resume: { ...current.resume, mode: "imported" } }))}>Mon design importé</button><p>{draft.resume.mode === "imported" ? "Votre PDF est utilisé tel quel. Les champs ci-dessous concernent uniquement le modèle du portfolio." : "Le modèle utilise les informations des étapes ci-dessous."}</p></div>
    <nav className="cv-steps" aria-label="Étapes de création du CV">{steps.map((label, index) => <button type="button" className={index === step ? "is-active" : index < step ? "is-done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check /> : index + 1}</span><strong>{label}</strong></button>)}</nav>
    <div className="cv-builder">
      <div className="cv-builder__form">
        {step === 0 && <fieldset><legend>01 — Identité et contact</legend><p className="cv-step-intro">Ces informations sont partagées avec votre portfolio : toute modification sera donc cohérente partout.</p><label>Nom complet<input value={draft.identity.name} onChange={(event) => setIdentity("name", event.target.value)} /></label><label>Titre professionnel<input value={draft.cv.headline} onChange={(event) => setCv("headline", event.target.value)} /></label><div className="admin-inline"><label>E-mail<input type="email" value={draft.identity.email} onChange={(event) => setIdentity("email", event.target.value)} /></label><label>Téléphone<input value={draft.cv.phone} onChange={(event) => setCv("phone", event.target.value)} /></label></div><div className="admin-inline"><label>Localisation<input value={draft.identity.location} onChange={(event) => setIdentity("location", event.target.value)} /></label><label>Site web<input value={draft.cv.website} onChange={(event) => setCv("website", event.target.value)} /></label></div><label>LinkedIn<input value={draft.identity.linkedinUrl} onChange={(event) => setIdentity("linkedinUrl", event.target.value)} /></label><label>GitHub<input value={draft.identity.githubUrl} onChange={(event) => setIdentity("githubUrl", event.target.value)} /></label></fieldset>}
        {step === 1 && <fieldset><legend>02 — Profil professionnel</legend><p className="cv-step-intro">Présentez en quelques lignes votre valeur, votre spécialité et le type de problèmes que vous savez résoudre.</p><label>Résumé<textarea rows={10} value={draft.cv.summary} onChange={(event) => setCv("summary", event.target.value)} /></label></fieldset>}
        {step === 2 && <fieldset><legend>03 — Expériences</legend><p className="cv-step-intro">Placez l’expérience la plus récente en premier. Une ligne dans “Réalisations” devient une puce dans le CV.</p><div className="cv-editor-list">{draft.cv.experiences.map((item, index) => <div key={index}><header><strong>Expérience {String(index + 1).padStart(2, "0")}</strong><div><button type="button" aria-label="Remonter cette expérience" disabled={index === 0} onClick={() => moveExperience(index, -1)}><ArrowUp /></button><button type="button" aria-label="Descendre cette expérience" disabled={index === draft.cv.experiences.length - 1} onClick={() => moveExperience(index, 1)}><ArrowDown /></button><button type="button" aria-label="Supprimer cette expérience" onClick={() => setCv("experiences", draft.cv.experiences.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></button></div></header><div className="admin-inline"><label>Période<input value={item.period} onChange={(event) => updateCvExperience(index, { period: event.target.value })} /></label><label>Entreprise<input value={item.place} onChange={(event) => updateCvExperience(index, { place: event.target.value })} /></label></div><label>Poste<input value={item.title} onChange={(event) => updateCvExperience(index, { title: event.target.value })} /></label><label>Réalisations, une par ligne<textarea rows={5} value={item.bullets.join("\n")} onChange={(event) => updateCvExperience(index, { bullets: event.target.value.split("\n") })} /></label></div>)}</div><button type="button" className="cv-add" onClick={() => setCv("experiences", [...draft.cv.experiences, { period: "", title: "Nouvelle expérience", place: "", bullets: [""] }])}><Plus /> Ajouter une expérience</button></fieldset>}
        {step === 3 && <fieldset><legend>04 — Formations</legend><p className="cv-step-intro">Ajoutez vos diplômes, certifications et programmes importants dans l’ordre souhaité.</p><div className="cv-editor-list">{draft.cv.education.map((item, index) => <div key={index}><header><strong>Formation {String(index + 1).padStart(2, "0")}</strong><div><button type="button" aria-label="Remonter cette formation" disabled={index === 0} onClick={() => moveEducation(index, -1)}><ArrowUp /></button><button type="button" aria-label="Descendre cette formation" disabled={index === draft.cv.education.length - 1} onClick={() => moveEducation(index, 1)}><ArrowDown /></button><button type="button" aria-label="Supprimer cette formation" onClick={() => setCv("education", draft.cv.education.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></button></div></header><div className="admin-inline"><label>Période<input value={item.period} onChange={(event) => updateCvEducation(index, { period: event.target.value })} /></label><label>Établissement<input value={item.place} onChange={(event) => updateCvEducation(index, { place: event.target.value })} /></label></div><label>Diplôme / formation<input value={item.title} onChange={(event) => updateCvEducation(index, { title: event.target.value })} /></label></div>)}</div><button type="button" className="cv-add" onClick={() => setCv("education", [...draft.cv.education, { period: "", title: "Nouvelle formation", place: "" }])}><Plus /> Ajouter une formation</button></fieldset>}
        {step === 4 && <fieldset><legend>05 — Projets techniques</legend><p className="cv-step-intro">Sélectionnez jusqu’à trois projets qui prouvent le mieux votre niveau de développement. Leur résumé doit expliquer ce que vous avez techniquement construit.</p><div className="cv-project-picker">{draft.projects.filter((project) => !project.commented).map((project) => { const selected = draft.cv.selectedProjectIds.includes(project.id); return <div className={selected ? "is-selected" : ""} key={project.id}><label className="cv-project-picker__toggle"><input type="checkbox" checked={selected} disabled={!selected && draft.cv.selectedProjectIds.length >= 3} onChange={() => toggleCvProject(project.id)} /><span><strong>{project.title}</strong><small>{project.technologies.slice(0, 5).join(" · ")}</small></span></label>{selected && <label>Résumé pour le CV<textarea rows={3} value={project.cvSummary || ""} placeholder="Expliquez en une phrase ce que vous avez techniquement construit." onChange={(event) => updateProjectSummary(project.id, event.target.value)} /></label>}</div>; })}</div></fieldset>}
        {step === 5 && <fieldset><legend>06 — Stack technique et langues</legend><p className="cv-step-intro">Placez en premier les technologies que vous maîtrisez réellement. Elles seront regroupées en Front-end, Back-end et Data & outils dans le CV.</p><label>Stack technique, séparée par des virgules<textarea rows={6} value={draft.cv.skills.join(", ")} onChange={(event) => setCv("skills", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} /></label><label>Langues<textarea rows={4} value={draft.cv.languages.join("\n")} onChange={(event) => setCv("languages", event.target.value.split("\n"))} /></label><label>Centres d’intérêt<textarea rows={4} value={draft.cv.interests.join("\n")} onChange={(event) => setCv("interests", event.target.value.split("\n"))} /></label></fieldset>}
        {step === 6 && <fieldset><legend>07 — Vérification et export</legend><div className="cv-ready-card"><Check /><div><strong>Votre CV de développeuse est prêt.</strong><p>Ouvrez votre brouillon pour vérifier et télécharger le CV. Publiez ensuite les changements pour mettre à jour le CV public.</p><Link to="/cv?preview=1" onClick={() => sessionStorage.setItem("rg-cv-preview", JSON.stringify(draft))} target="_blank">Ouvrir et télécharger <Download /></Link></div></div><div className="admin-resume__compact"><FileText /><div><strong>{draft.resume.fileName || "Aucun ancien PDF conservé"}</strong><small>Importez un PDF pour utiliser directement votre propre design.</small></div><label><Upload /> Importer mon design<input type="file" accept="application/pdf" onChange={onUpload} /></label></div></fieldset>}
        <footer className="cv-step-actions"><button type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}><ChevronLeft /> Précédent</button><span>Étape {step + 1} sur {steps.length}</span><button type="button" disabled={step === steps.length - 1} onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Suivant <ChevronRight /></button></footer>
      </div>
      <aside className="cv-builder__preview"><div className="cv-preview-bar"><span>Aperçu en direct</span><Link to="/cv?preview=1" onClick={() => sessionStorage.setItem("rg-cv-preview", JSON.stringify(draft))} target="_blank">Ouvrir en grand <Eye /></Link></div>{draft.resume.mode === "imported" && draft.resume.url ? <PdfResume url={draft.resume.url} fileName={draft.resume.fileName} /> : <ResumePreview content={draft} />}</aside>
    </div>
  </div>;
};



export default Admin;
