import { useTranslation } from 'react-i18next'
import { CheckCircle2, FileText, Globe } from 'lucide-react'
import brandBackground from '@/assets/BG.jpg'
import efficientIcon from '@/assets/Efficiet.png'
import insightfulIcon from '@/assets/Insightful.png'
import kranLogo from '@/assets/KRAN.png'
import reliableIcon from '@/assets/Reliable.png'
import secureIcon from '@/assets/Secure.png'
import { Card, CardBody } from '@/shared/lib/tailwreck'

const FEATURES = [
  {
    icon: secureIcon,
    title: 'Secure',
    description: 'Grade security for your data',
  },
  {
    icon: insightfulIcon,
    title: 'Insightful',
    description: 'Real-time insights that drive growth',
  },
  {
    icon: reliableIcon,
    title: 'Reliable',
    description: 'Built for accuracy, trusted',
  },
  {
    icon: efficientIcon,
    title: 'Efficient',
    description: 'Streamlined for better outcomes',
  },
]

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex min-w-0 flex-1 basis-0 flex-col items-center justify-center text-center lg:px-4 lg:py-[22px] max-lg:px-1 max-lg:py-2 max-lg:max-[399px]:px-0.5 max-lg:max-[399px]:py-1.5 max-lg:sm:px-1.5 max-lg:sm:py-3 max-lg:md:px-2 max-lg:md:py-4">
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="object-contain lg:h-[29px] lg:w-[26px] max-lg:h-[22px] max-lg:w-5 max-lg:max-[399px]:h-5 max-lg:max-[399px]:w-[22px] max-lg:sm:h-[24px] max-lg:sm:w-[22px]"
        decoding="async"
      />
      <h3 className="font-sans font-semibold text-slate-900 lg:mt-3 lg:text-[12px] lg:leading-[17px] max-lg:mt-1.5 max-lg:text-[10px] max-lg:leading-none max-lg:max-[399px]:text-[9px] max-lg:sm:mt-1.5 max-lg:sm:text-[11px] max-lg:md:text-xs">
        {title}
      </h3>
      <p className="font-sans text-slate-900 lg:mt-1 lg:h-34 lg:w-[112px] lg:max-w-[112px] lg:line-clamp-none lg:text-[12px] lg:leading-[16px] max-lg:mt-1 max-lg:min-w-0 max-lg:w-full max-lg:max-w-[3.25rem] max-lg:overflow-hidden max-lg:text-[8px] max-lg:leading-[11px] max-lg:line-clamp-2 max-lg:max-[399px]:max-w-[3rem] max-lg:sm:max-w-[4.5rem] max-lg:sm:text-[9px] max-lg:sm:leading-3 max-lg:md:max-w-[5.25rem] max-lg:md:text-[10px] max-lg:md:leading-[13px]">
        {description}
      </p>
    </div>
  )
}

export default function BrandPanel({ footerSlot = null }) {
  const { t } = useTranslation()

  return (
    <section
      className="relative isolate h-full min-h-0 w-full max-w-full overflow-hidden max-lg:min-h-[min(100dvh,42rem)] lg:h-svh lg:min-h-0"
      aria-label="KRAN Consulting Design System"
    >
      <img
        src={brandBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_45%] lg:object-center"
        decoding="async"
        fetchpriority="high"
      />

      <div
        className="absolute inset-0 bg-gradient-to-br from-white/88 via-[#eef4fc]/78 to-[#dbe8f9]/72 lg:from-white/82 lg:via-[#eef4fc]/70 lg:to-[#dbe8f9]/65"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full min-h-[inherit] w-full max-w-full flex-col px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7 lg:px-[66px] lg:py-[40px]">
        <header className="flex shrink-0 items-start justify-between gap-2 max-[399px]:gap-2 sm:gap-4 md:gap-6">
          <div className="ml-0 mt-6 min-w-0 flex flex-col gap-0 sm:mt-6 md:mt-8 lg:mt-[80px]">
            <h1 className="font-sans text-[28px] font-bold leading-9 tracking-[0px] text-slate-900 sm:text-[38px] sm:leading-[52px] lg:text-[43px] lg:leading-[64px]">
              KRAN
            </h1>

            <p className="font-sans text-sm font-medium leading-5 tracking-[0px] text-slate-800 lg:text-[18px] lg:leading-[24px]">
              {t('Design System & UI Library')}
            </p>
          </div>

          <img
            src={kranLogo}
            alt="KRAN"
            className="h-6 w-auto max-w-20 shrink-0 object-contain object-right max-[399px]:h-6 max-[399px]:max-w-20 sm:h-8 sm:max-w-[140px] md:h-9 md:max-w-[160px] lg:mt-[48px] lg:h-[48px] lg:max-w-[200px]"
            decoding="async"
          />
        </header>

        <div className="mb-3 mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm sm:mb-4 sm:px-4">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#01458e]" aria-hidden />
          <span className="text-xs font-semibold tracking-wide text-[#01458e] md:text-[13px]">
            {t('brand.taglineBadge', 'Accessible. Modular. Enterprise-ready.')}
          </span>
        </div>

        <div className="ml-0 mt-4 shrink-0 sm:mt-6 md:mt-8 lg:mt-[72px]">
          <div className="w-full max-w-[439px] max-md:max-w-full">
            <h2 className="font-sans text-2xl font-medium leading-8 text-slate-900 sm:text-[32px] sm:leading-[42px] lg:text-[36px] lg:leading-[48px]">
              Enterprise
              <span className="mt-0 block font-sans text-2xl font-bold leading-8 text-[#1348C3] sm:text-[32px] sm:leading-[48px] lg:text-[36px] lg:leading-[48px]">
                Design System
                <span className="ml-1 rounded text-[1.2em] leading-none text-[#face00]">.</span>
              </span>
            </h2>
            <p className="mt-3 font-sans text-[13px] font-medium leading-5 text-slate-900 sm:mt-4 lg:text-[14px] lg:leading-[20px]">
              Standardized UI architecture, accessible components, and modular layouts for KRAN Consulting frontend applications.
            </p>
          </div>
        </div>

        <div className="mt-auto mb-8 w-full min-w-0 shrink-0 pt-4 max-sm:mb-8 sm:mb-10 lg:mb-[110px] lg:pt-0">
          {footerSlot}
          <Card
            theme="no-preset"
            shadow="none"
            className="!flex !flex-col w-full overflow-hidden !rounded-[5px] border border-white/90 bg-white/95 shadow-[0_8px_28px_rgba(15,40,80,0.09)] backdrop-blur-[1px] lg:!h-[169px] lg:!min-h-[169px] max-lg:!h-[84px] max-lg:!min-h-[84px] max-lg:sm:!h-[90px] max-lg:sm:!min-h-[90px]"
          >
            <CardBody className="flex min-h-0 flex-1 p-0 !opacity-100 !leading-normal">
              <div className="flex h-full w-full min-w-0 divide-x divide-slate-200/90 overflow-hidden">
                {FEATURES.map((feature) => (
                  <FeatureItem key={feature.title} {...feature} />
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-slate-200 bg-[#F4F7FB] px-3 py-2 text-[10px] font-medium text-slate-800 sm:mt-5 sm:text-[11px]">
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3 w-3 shrink-0 text-[#01458e]" aria-hidden />
              {t('brand.securityLine1', 'Enterprise-grade security for organisational data')}
            </span>
            <span className="text-slate-400" aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3 w-3 shrink-0 text-[#01458e]" aria-hidden />
              {t('brand.securityLine2', 'Policy & audit aligned components')}
            </span>
          </div>
          <p className="mt-3 w-full font-sans font-normal text-[#1D1D1D] max-lg:text-[10px] max-lg:leading-[18px] max-lg:max-[399px]:text-[8px] max-lg:max-[399px]:leading-[14px] max-lg:sm:text-[11px] lg:text-[12px] lg:leading-[22px]">
            ©2026 KRAN Consulting. All rights reserved
          </p>
        </div>
      </div>
    </section>
  )
}
