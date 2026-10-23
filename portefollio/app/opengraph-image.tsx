import { shareImage, shareSize } from '@/lib/og';

export const alt = 'Malcolm Boukaka-Massengo · Chef de projet SI & Product builder';
export const size = shareSize;
export const contentType = 'image/png';

export default function OgImage() {
  return shareImage({
    label: 'CHEF DE PROJET SI · PRODUCT BUILDER',
    name: ['Malcolm', 'Boukaka-Massengo'],
    tagline: 'Processus, automatisation, intégration et IA, du cadrage au déploiement.',
    side: 'PARIS · DISPONIBLE',
  });
}
