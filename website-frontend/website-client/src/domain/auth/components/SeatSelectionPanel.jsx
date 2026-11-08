import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/shared/components/buttons'
import { FORM_FOOTER_PRIMARY_CLASS } from '@/shared/components/buttons/actionButtonStyles'
import {
  PAGE_INNER_SECTION_TITLE_CLASS,
  PAGE_TABLE_CLASS,
  PAGE_TABLE_HEAD_ROW_CLASS,
  PAGE_TABLE_TH_CLASS,
} from '@/shared/constants/pageContentStyles'

export default function SeatSelectionPanel({
  user,
  seats,
  selectingId,
  selectError,
  listError,
  onSelect,
}) {
  const { t } = useTranslation()
  const seatCount = seats.length
  const seatCountLabel = `${seatCount} ${seatCount === 1 ? t('seats.seat') : t('seats.seats')}`

  return (
    <section aria-label={t('seats.allotted')} className="mx-auto w-full max-w-[1180px]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-100 px-5 py-3 sm:px-6">
          <div>
            <h3 className={PAGE_INNER_SECTION_TITLE_CLASS}>{t('seats.allotted')}</h3>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-xs">{t('seats.allottedHelp')}</p>
          </div>
          <span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
            {seatCountLabel}
          </span>
        </div>

        {listError ? (
          <p className="px-5 py-6 font-noto text-sm font-medium text-red-600" role="alert">
            {listError}
          </p>
        ) : null}

        {selectError ? (
          <p className="px-5 pt-4 font-noto text-sm font-medium text-red-600" role="alert">
            {selectError}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className={`min-w-[760px] w-full ${PAGE_TABLE_CLASS}`}>
            <thead className="bg-[#F4FAFF] dark:bg-slate-900">
              <tr className={PAGE_TABLE_HEAD_ROW_CLASS}>
                <th className={`min-w-[4.75rem] sm:px-6 ${PAGE_TABLE_TH_CLASS}`}>Sl. No.</th>
                <th className={PAGE_TABLE_TH_CLASS}>{t('seats.seatCol')}</th>
                <th className={PAGE_TABLE_TH_CLASS}>{t('seats.seatCode')}</th>
                {/* <th className={PAGE_TABLE_TH_CLASS}>Office</th> */}
                <th className={PAGE_TABLE_TH_CLASS}>{t('seats.designation')}</th>
                <th className={`w-[120px] text-center sm:px-6 ${PAGE_TABLE_TH_CLASS}`}>
                  {t('seats.action')}
                </th>
              </tr>
            </thead>
            <tbody>
              {seats.length === 0 && !listError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center font-noto text-sm text-slate-500 sm:px-6"
                  >
                    {t('seats.empty')}
                  </td>
                </tr>
              ) : (
                seats.map((seat) => {
                  const isSelecting = selectingId === seat.idMask
                  return (
                    <tr
                      key={seat.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-4 text-center align-middle text-sm text-slate-600 sm:px-6">
                        {seat.serial}
                      </td>
                      <td className="px-4 py-4 text-center align-middle text-sm font-semibold text-slate-800">
                        {seat.name}
                      </td>
                      <td className="px-4 py-4 text-center align-middle text-sm text-slate-600">
                        {seat.hierarchyCode || seat.code}
                      </td>
                      {/* <td className="px-4 py-4 text-sm text-slate-600">
                        {seat.office}
                      </td> */}
                      <td className="px-4 py-4 text-center align-middle text-sm text-slate-600">
                        {seat.postingName || seat.designation}
                      </td>
                      <td className="px-5 py-4 text-center align-middle sm:px-6">
                        <PrimaryButton
                          type="button"
                          disabled={Boolean(selectingId)}
                          onClick={() => onSelect(seat.idMask)}
                          className={FORM_FOOTER_PRIMARY_CLASS}
                        >
                          {isSelecting
                            ? t('seats.selecting', { defaultValue: 'Selecting…' })
                            : t('seats.select', { defaultValue: 'Select' })}
                        </PrimaryButton>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
