import { useState } from 'react'
import {
  DASHBOARD_FINANCIAL_YEAR_OPTIONS,
  getCurrentFinancialYear,
} from '../constants/dashboardCards'
import {
  useGetDashboardCardListQuery,
  useGetDashboardChartListQuery,
} from '../services/dashboardApi'

const EMPTY_WIDGETS = []

export function useDashboardCards() {
  const [financialYear, setFinancialYear] = useState(getCurrentFinancialYear)

  const {
    data: cards = EMPTY_WIDGETS,
    isLoading: isLoadingCards,
    isFetching: isFetchingCards,
    isError: isCardsError,
    error: cardsError,
    refetch: refetchCards,
  } = useGetDashboardCardListQuery({ financialYear })

  const {
    data: charts = EMPTY_WIDGETS,
    isLoading: isLoadingCharts,
    isFetching: isFetchingCharts,
    isError: isChartsError,
    error: chartsError,
    refetch: refetchCharts,
  } = useGetDashboardChartListQuery({ financialYear })

  const refetch = () => {
    refetchCards()
    refetchCharts()
  }

  return {
    financialYear,
    setFinancialYear,
    financialYearOptions: DASHBOARD_FINANCIAL_YEAR_OPTIONS,
    cards,
    charts,
    isLoading: isLoadingCards || isLoadingCharts,
    isLoadingCards,
    isLoadingCharts,
    isFetching: isFetchingCards || isFetchingCharts,
    isFetchingCards,
    isFetchingCharts,
    isError: isCardsError || isChartsError,
    errorMessage:
      cardsError?.data?.message ||
      cardsError?.message ||
      chartsError?.data?.message ||
      chartsError?.message ||
      '',
    refetch,
  }
}
