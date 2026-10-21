export type ProjectFile = {
  url: string;
  name: string;
  kind: 'image' | 'pdf';
  // titre et explication affichés sous l'écran, sur la page projet
  title?: string;
  caption?: string;
  // image servant d'icône de l'application (carte et en-tête de la page projet)
  icon?: boolean;
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
  // objet 3D de couverture (clé de lib/visuals.ts), utilisé quand le projet n'a pas d'image
  visual?: string;
  // couleur de fond des écrans (celle de l'application), ex. #d6d4fc
  color?: string;
  // ex. « En production »
  status?: string;
};
