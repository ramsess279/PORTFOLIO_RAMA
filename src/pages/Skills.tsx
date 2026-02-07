import { Card } from "@/components/ui/card";
import { FaReact, FaDocker, FaGithub, FaNodeJs, FaDatabase, FaFigma, FaGitAlt, FaJs, FaHtml5, FaCss3Alt, FaAngular } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiExpress, SiPrisma, SiZod, SiPostgresql, SiMysql, SiPhp, SiC, SiCanva, SiMongodb } from "react-icons/si";

const competences = [
  {
    categorie: "Langages",
    items: [
      { label: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
      { label: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
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
      { label: "MongoDB", icon: <SiMongodb className="text-blue-400" /> },
    ],
  },
  {
    categorie: "Frameworks & Librairies",
    items: [
      { label: "React", icon: <FaReact className="text-cyan-400" /> },
      { label: "Angular", icon: <FaAngular className="text-cyan-400" /> },
      { label: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
      { label: "Express", icon: <SiExpress className="text-gray-700" /> },
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
      { label: "" },
    ],
  },
  {
    categorie: "Outils & DevOps",
    items: [
      { label: "Git", icon: <FaGitAlt className="text-orange-500" /> },
      { label: "GitHub", icon: <FaGithub className="text-black" /> },
      { label: "Docker", icon: <FaDocker className="text-blue-400" /> },
      { label: "Figma", icon: <FaFigma className="text-pink-500" /> },
      { label: "Canva", icon: <SiCanva className="text-blue-400" /> },
      { label: "Illustrator" },
      { label: "JSON Server" },
    ],
  },
  {
    categorie: "Architecture & Modélisation",
    items: [
      { label: "REST API" },
      { label: "StartUML" },
      { label: "Mermaid" },
    ],
  },
];

const Skills = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-background to-primary/2">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          {competences.map((cat, i) => (
            <Card
              key={cat.categorie}
              className={`glass hover-glow p-8 rounded-2xl animate-fade-in group flex flex-col gap-4 shadow-xl border-0`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-xl font-semibold mb-2 text-primary flex items-center gap-2 border-b border-primary/20 pb-2">
                {cat.categorie}
              </h3>
              <ul className="flex flex-col gap-3">
                {cat.items.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-lg text-foreground/90 font-medium">
                    {skill.icon && (
                      <span className={`text-2xl ${skill.label === 'React' ? 'slow-rotate' : ''}`}>
                        {skill.icon}
                      </span>
                    )}
                    <span>{skill.label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;