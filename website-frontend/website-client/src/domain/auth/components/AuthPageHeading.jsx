export default function AuthPageHeading({ title, subtitle, className = '' }) {
  return (
    <header className={`mb-6 lg:mb-8 ${className}`}>
      <h1 className="font-noto text-[30px] font-bold leading-tight text-[#01458E] sm:text-[30px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 font-noto text-[16px] font-medium leading-[150%] tracking-normal text-probity-ink">
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}
