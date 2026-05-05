interface OutlineImageProps {
  src: string
  alt: string
  className?: string
}

const corner =
  'absolute w-[4%] aspect-square border-primary border-2 animate-[bracket-pulse_3.5s_ease-in-out_infinite]'

export function OutlineImage({ src, alt, className }: OutlineImageProps) {
  return (
    <div className={`not-prose relative inline-block leading-[0] ${className ?? ''}`}>
      <span className={`${corner} -top-1 -left-1   border-r-0 border-b-0 [--bx:-2px] [--by:-2px]`} />
      <span className={`${corner} -top-1 -right-1  border-l-0 border-b-0 [--bx:2px]  [--by:-2px]`} />
      <span className={`${corner} -bottom-1 -left-1  border-r-0 border-t-0 [--bx:-2px] [--by:2px]`} />
      <span className={`${corner} -bottom-1 -right-1 border-l-0 border-t-0 [--bx:2px]  [--by:2px]`} />
      <img src={src} alt={alt} className="block w-full h-full object-cover" />
    </div>
  )
}
