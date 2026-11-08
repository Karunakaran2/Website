import kranMarkSrc from '@/assets/kran-mark.png'

/** Footer/header KRAN mark — single asset (`kran-mark.png`). */
export { kranMarkSrc }

export default function KranMarkLogo({
  className = 'h-auto w-[60px] max-w-[60px] shrink-0 object-contain',
  alt = 'KRAN',
  ...rest
}) {
  return <img src={kranMarkSrc} alt={alt} className={className} {...rest} />
}
