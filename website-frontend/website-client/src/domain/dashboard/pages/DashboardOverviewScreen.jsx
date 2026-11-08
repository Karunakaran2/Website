import { useTranslation } from 'react-i18next'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import {
  GIGW_ADD_ICON,
  GIGW_EDIT_ICON,
  GigwButton,
} from '@/shared/components/buttons'
import DashboardCardGrid from '../components/DashboardCardGrid'
import DashboardChartGrid from '../components/DashboardChartGrid'
import DashboardOverviewSkeleton from '../components/DashboardOverviewSkeleton'
import DashboardHiddenWidgetsPanel from '../components/DashboardHiddenWidgetsPanel'
import DashboardYearFilter from '../components/DashboardYearFilter'
import { DASHBOARD_WIDGET_STACK_CLASS } from '../constants/dashboardStyles'
import { useDashboardCards } from '../hooks/useDashboardCards'
import { useDashboardLayout } from '../hooks/useDashboardLayout'

export default function DashboardOverviewScreen() {
  const { t } = useTranslation()
  const {
    financialYear,
    setFinancialYear,
    financialYearOptions,
    cards,
    charts,
    isLoading,
    isLoadingCards,
    isLoadingCharts,
    isFetchingCards,
    isFetchingCharts,
    isError,
    errorMessage,
    refetch,
  } = useDashboardCards()

  const {
    editMode,
    showHiddenPanel,
    localCards,
    localCharts,
    hiddenWidgets,
    isFetchingHidden,
    isSaving,
    toggleEditMode,
    toggleHiddenPanel,
    closeHiddenPanel,
    hideWidget,
    restoreWidget,
    changeWidgetColor,
    reorderCards,
    reorderCharts,
  } = useDashboardLayout({ cards, charts, refetch })

  const displayCards = editMode ? localCards : cards
  const displayCharts = editMode ? localCharts : charts

  const cardsLoading =
    !editMode && (isLoadingCards || isFetchingCards)
  const chartsLoading =
    !editMode && (isLoadingCharts || isFetchingCharts)
  const showFullPageSkeleton =
    !editMode && !isError && isLoading && cards.length === 0 && charts.length === 0

  return (
    <>
      <DashboardPageHeaderActions>
        <div className="flex flex-wrap items-center gap-2">
          <DashboardYearFilter
            label={t('dashboard.financialYear', { defaultValue: 'Financial Year' })}
            value={financialYear}
            options={financialYearOptions}
            onChange={setFinancialYear}
            disabled={editMode}
          />
          <GigwButton
            type="button"
            variant="primary"
            onClick={() => refetch()}
            disabled={editMode}
            loading={cardsLoading || chartsLoading}
          >
            {t('dashboard.applyFilter', { defaultValue: 'Apply Filter' })}
          </GigwButton>
          <GigwButton
            type="button"
            variant={editMode ? 'primary' : 'secondary'}
            icon={editMode ? undefined : GIGW_EDIT_ICON}
            onClick={toggleEditMode}
            loading={isSaving}
          >
            {editMode
              ? t('dashboard.saveLayout', { defaultValue: 'Save Layout' })
              : t('dashboard.editLayout', { defaultValue: 'Edit Layout' })}
          </GigwButton>
          <GigwButton
            type="button"
            variant="secondary"
            icon={GIGW_ADD_ICON}
            onClick={toggleHiddenPanel}
          >
            {t('dashboard.addWidgets', { defaultValue: 'Add Widgets' })}
          </GigwButton>
        </div>
      </DashboardPageHeaderActions>

      {isError ? (
        <div
          role="alert"
          className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
        >
          {errorMessage ||
            t('dashboard.loadError', { defaultValue: 'Unable to load dashboard widgets.' })}
        </div>
      ) : null}

      {showHiddenPanel ? (
        <DashboardHiddenWidgetsPanel
          widgets={hiddenWidgets}
          isLoading={isFetchingHidden}
          onRestore={restoreWidget}
          onClose={closeHiddenPanel}
        />
      ) : null}

      {showFullPageSkeleton ? (
        <DashboardOverviewSkeleton />
      ) : (
        <div className={DASHBOARD_WIDGET_STACK_CLASS}>
          <div className="min-w-0">
            <DashboardCardGrid
              cards={displayCards}
              isLoading={cardsLoading}
              editMode={editMode}
              onHide={hideWidget}
              onColorChange={changeWidgetColor}
              onReorder={reorderCards}
            />
          </div>
          <div className="min-w-0">
            <DashboardChartGrid
              charts={displayCharts}
              isLoading={chartsLoading}
              editMode={editMode}
              onHide={hideWidget}
              onColorChange={changeWidgetColor}
              onReorder={reorderCharts}
            />
          </div>
        </div>
      )}
    </>
  )
}
