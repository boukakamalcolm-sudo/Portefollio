import { shareImage, shareSize } from '@/lib/og';

export const alt = 'Malcolm · Product builder';
export const size = shareSize;
export const contentType = 'image/png';

export default function OgImage() {
  return shareImage({
    label: 'PRODUCT BUILDER',
    name: ['Malcolm'],
    tagline: 'Applications et outils sur mesure, du premier échange à la mise en ligne.',
    side: 'PARIS · SUR DEVIS',
  });
}
