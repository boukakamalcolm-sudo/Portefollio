export const pad = (n: number) => String(n).padStart(2, '0');

export const projectHref = (id: string) => `/projets/${encodeURIComponent(id)}`;

// Texte saisi dans l'admin : une ligne = un élément (puces « - » ou « • » acceptées)
export const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.replace(/^\s*[-•–]\s*/, '').trim())
    .filter(Boolean);
