import Image from 'next/image';

// Capture d'application dans une fenêtre de navigateur, avec le petit objet 3D du projet sur le côté
export default function Shot({ src, logo, alt = '', sizes, priority }: {
  src: string;
  logo: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      <div className="shot">
        <span className="shot-bar" aria-hidden="true"><i /><i /><i /></span>
        <div className="shot-img"><Image src={src} alt={alt} fill sizes={sizes} priority={priority} /></div>
      </div>
      <Image className="shot-logo" src={logo} alt="" width={200} height={200} />
    </>
  );
}
