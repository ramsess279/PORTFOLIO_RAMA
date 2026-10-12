import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useReveal } from "@/hooks/useReveal";

const formations = [
  {
    titre: "Licence 3 Développement Web/Mobile & Génie Logiciel",
    etablissement: "ESP 221 (École Supérieure Professionnelle 221)",
    periode: "2026 - En cours",
    description: "Approfondissement du développement web, mobile, de l’architecture logicielle et de la conduite de projets numériques.",
  },
  {
    titre: "Développement FullStack Web/Mobile",
    etablissement: "Orange Digital Center",
    periode: "2025",
    description: "Programme pratique centré sur la conception et la livraison d’applications full-stack web et mobile.",
  },
  {
    titre: "Licence 2 IDA",
    etablissement: "Université Cheikh Hamidou Kane",
    periode: "2022 - 2025",
    description: "Formation universitaire en informatique, algorithmique, développement applicatif et systèmes d’information.",
  },
  {
    titre: "DST en Génie Informatique",
    etablissement: "ESP",
    periode: "2022 - 2024",
    description: "Diplôme supérieur technique orienté génie informatique et développement de solutions logicielles.",
  },
  {
    titre: "Bac S2",
    etablissement: "Complexe Symbiose",
    periode: "2021 - 2022",
    description: "Baccalauréat scientifique, socle de mon parcours en ingénierie et développement.",
  },
];

const Education = () => {
  const ref = useReveal();

  return (
    <div ref={ref} className="pt-28 pb-24 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          eyebrow="Mon cursus"
          title={
            <>
              Une <em className="accent-italic">formation</em> continue
            </>
          }
        />

        <div className="education-school-list">
          {formations.map((formation, index) => (
            <div
              key={index}
              className="education-school-card reveal-blur group"
              style={{ transitionDelay: `${index * 0.06}s` }}
            >
              <div className="education-school-card__mark"><GraduationCap strokeWidth={1.5} /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="education-school-card__body"><p>{formation.etablissement}</p><h3>{formation.titre}</h3><span>{formation.description}</span></div>
              <time>{formation.periode}</time>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
