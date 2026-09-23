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
  solution: string;
  result: string;
  files: ProjectFile[];
};
