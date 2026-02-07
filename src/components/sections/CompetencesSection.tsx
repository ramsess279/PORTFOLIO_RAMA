import { Card } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { FaReact, FaDocker, FaGithub, FaNodeJs, FaDatabase, FaFigma, FaGitAlt, FaJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
 import { SiTypescript, SiTailwindcss, SiExpress, SiPrisma, SiZod, SiPostgresql, SiMysql, SiPhp, SiC, SiCanva } from "react-icons/si";
 import skillsData from "@/data/skills.json";

const competences = skillsData.skillCategories;

const CompetencesSection = () => {
	return (
		<section className="min-h-screen flex items-center justify-center py-20 pb-32 px-4 bg-gradient-to-br from-background to-primary/10">
			<div className="container mx-auto max-w-4xl">
				<h2 className="text-5xl font-bold text-center mb-16 text-foreground animate-fade-in">
					Compétences
				</h2>
				<div className="grid md:grid-cols-2 gap-10">
					{competences.map((cat, i) => (
						<Card
							key={cat.category}
							className={`glass hover-glow p-8 rounded-2xl animate-fade-in group flex flex-col gap-4 border-0`}
							style={{ animationDelay: `${i * 0.1}s` }}
						>
							<h3 className="text-xl font-semibold mb-2 text-primary flex items-center gap-2 border-b border-primary/20 pb-2">
								{cat.category}
							</h3>
							<ul className="flex flex-col gap-3">
								{cat.items.map((skill, idx) => (
									<li key={idx} className="flex items-center gap-3 text-lg text-foreground/90 font-medium">
										{skill.icon && <span className="text-2xl">{skill.icon}</span>}
										<span>{skill.name}</span>
									</li>
								))}
							</ul>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default CompetencesSection;
