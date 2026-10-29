import type { PortfolioContent } from "@/types/portfolio";

export const previousDmmDescription = "Analyse des besoins, conception des parcours, développement d’interfaces et de services back-end, intégration d’API, modélisation des données, correction d’anomalies et préparation des mises en production.";
export const dmmMissions = [
  "Analyser les besoins métier et les traduire en fonctionnalités adaptées aux équipes.",
  "Concevoir les parcours utilisateurs et les interfaces des applications métier.",
  "Développer les services back-end et la logique métier des fonctionnalités.",
  "Intégrer les API et les échanges de données entre les interfaces et les services.",
  "Modéliser les données et leurs relations pour répondre aux besoins des applications.",
  "Diagnostiquer et corriger les anomalies pour fiabiliser les fonctionnalités.",
  "Préparer les mises en production et veiller à la maintenabilité du code.",
];
export const formatPortfolioExperience = (experience: PortfolioContent["experiences"][number]) => {
  const missions = /digital media mobile/i.test(experience.place) && experience.text === previousDmmDescription ? dmmMissions : experience.text.split(/;\s*/).filter(Boolean);
  return [experience.title, experience.period, experience.place, ...missions.map((mission) => `• ${mission.trim()}`)].join("\n");
};
