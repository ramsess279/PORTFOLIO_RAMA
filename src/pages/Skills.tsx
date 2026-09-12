import { FaReact, FaDocker, FaGithub, FaNodeJs, FaFigma, FaGitAlt, FaJs, FaHtml5, FaCss3Alt, FaJava } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiExpress, SiPrisma, SiZod, SiPostgresql, SiMysql, SiPhp, SiC, SiCanva, SiSymfony, SiSpringboot, SiApachemaven, SiGradle, SiJunit5, SiJira, SiNotion } from "react-icons/si";
import { PageHeader } from "@/components/PageHeader";
import { useReveal } from "@/hooks/useReveal";

const competences = [
  {
    categorie: "Langages",
    items: [
      { label: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
      { label: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
      { label: "Java", icon: <FaJava className="text-red-500" /> },
      { label: "C", icon: <SiC className="text-blue-700" /> },
      { label: "PHP", icon: <SiPhp className="text-indigo-500" /> },
      { label: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
      { label: "CSS", icon: <FaCss3Alt className="text-blue-400" /> },
    ],
  },
  {
    categorie: "Bases de données",
    items: [
      { label: "PostgreSQL", icon: <SiPostgresql className="text-blue-700" /> },
      { label: "MySQL", icon: <SiMysql className="text-blue-400" /> },
    ],
  },
  {
    categorie: "Frameworks & Librairies",
    items: [
      { label: "React", icon: <FaReact className="text-cyan-400" /> },
      { label: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
      { label: "Express", icon: <SiExpress className="text-gray-700" /> },
      { label: "Symfony", icon: <SiSymfony className="text-gray-500" /> },
      { label: "Spring Boot", icon: <SiSpringboot className="text-green-600" /> },
      { label: "Spring Data JPA", icon: <SiSpringboot className="text-green-600" /> },
      { label: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-500" /> },
      { label: "Prisma", icon: <SiPrisma className="text-black" /> },
      { label: "Zod", icon: <SiZod className="text-green-700" /> },
    ],
  },
  {
    categorie: "Paradigmes & Méthodes",
    items: [
      { label: "POO" },
      { label: "SOLID" },
      { label: "MVC" },
    ],
  },
  {
    categorie: "Architecture & Modélisation",
    items: [
      { label: "REST API" },
      { label: "Architecture Hexagonale (DDD)" },
      { label: "StartUML" },
      { label: "Mermaid" },
    ],
  },
  {
    categorie: "Outils & DevOps",
    items: [
      { label: "Git", icon: <FaGitAlt className="text-orange-500" /> },
      { label: "GitHub", icon: <FaGithub className="text-black" /> },
      { label: "Docker", icon: <FaDocker className="text-blue-400" /> },
      { label: "Maven", icon: <SiApachemaven className="text-red-600" /> },
      { label: "Gradle", icon: <SiGradle className="text-cyan-700" /> },
      { label: "JUnit", icon: <SiJunit5 className="text-green-700" /> },
      { label: "JSON Server" },
    ],
  },
  {
    categorie: "Business Analyst",
    items: [
      { label: "Recueil de besoins & cahier des charges" },
      { label: "Rédaction de user stories" },
      { label: "Modélisation UML" },
      { label: "BPMN" },
      { label: "Méthode MoSCoW" },
      { label: "Agile / Scrum" },
      { label: "Jira", icon: <SiJira className="text-blue-500" /> },
      { label: "Notion", icon: <SiNotion className="text-foreground" /> },
    ],
  },
  {
    categorie: "Design & UX",
    items: [
      { label: "Figma", icon: <FaFigma className="text-pink-500" /> },
      { label: "Canva", icon: <SiCanva className="text-blue-400" /> },
      { label: "Illustrator" },
    ],
  },
];

const Skills = () => {
  const ref = useReveal();

  return (
    <div ref={ref} className="pt-28 pb-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Ce que je maîtrise"
          title={
            <>
              Compétences <em className="accent-italic">techniques</em> & humaines
            </>
          }
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competences.map((cat, i) => (
            <div
              key={cat.categorie}
              className="reveal-blur border border-border rounded-2xl p-7 hover:border-primary/40 transition-colors"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <h3 className="text-lg mb-4 text-primary border-b border-border pb-3">
                {cat.categorie}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {cat.items.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground/90">
                    {skill.icon && <span className="text-lg flex-shrink-0">{skill.icon}</span>}
                    <span className="text-sm">{skill.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
