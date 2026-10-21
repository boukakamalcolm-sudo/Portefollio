export type ProjectFile = {
  url: string;
  name: string;
  kind: 'image' | 'pdf';
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  sector: string;
  tags: string[];
  problem: string;
  // une ligne par action
  solution: string;
  result: string;
  files: ProjectFile[];
  // absents des projets enregistrés avant l'ajout de ces champs
  role?: string;
  period?: string;
  stack?: string[];
};
