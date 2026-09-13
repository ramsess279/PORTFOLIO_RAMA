import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useReveal } from "@/hooks/useReveal";

const formations = [
  {
    titre: "Licence 3 Développement Web/Mobile & Génie Logiciel",
    etablissement: "ESP 221 (École Supérieure Professionnelle 221)",
    periode: "2026 - En cours",
  },
  {
    titre: "Développement FullStack Web/Mobile",
    etablissement: "Orange Digital Center",
    periode: "2025",
  },
  {
    titre: "Licence 2 IDA",
    etablissement: "Université Cheikh Hamidou Kane",
    periode: "2022 - 2025",
  },
  {
    titre: "DST en Génie Informatique",
    etablissement: "ESP",
    periode: "2022 - 2024",
  },
  {
    titre: "Bac S2",
    etablissement: "Complexe Symbiose",
    periode: "2021 - 2022",
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

        <div className="border-t border-border">
          {formations.map((formation, index) => (
            <div
              key={index}
              className="reveal-blur flex items-center gap-5 py-6 px-4 -mx-4 rounded-xl border-b border-border group transition-all duration-300 hover:bg-muted/50 hover:px-6"
              style={{ transitionDelay: `${index * 0.06}s` }}
            >
              <GraduationCap
                className="h-6 w-6 text-primary flex-shrink-0 transition-transform group-hover:scale-110"
                strokeWidth={1.5}
              />
              <div className="flex-1">
                <h3 className="text-lg leading-snug">{formation.titre}</h3>
                <p className="text-primary text-sm font-medium mt-0.5">{formation.etablissement}</p>
              </div>
              <span className="text-sm text-muted-foreground flex-shrink-0 text-right">
                {formation.periode}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
