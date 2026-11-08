const PIE_COLORS = [
  '#4ade80',
  '#60a5fa',
  '#f87171',
  '#facc15',
  '#c084fc',
  '#fb923c',
  '#2dd4bf',
  '#a3e635',
  '#38bdf8',
  '#f472b6',
  '#818cf8',
  '#34d399',
  '#fb7185',
  '#fde047',
  '#67e8f9',
]

export function formatDashboardAmount(value) {
  const amount = Number(value || 0)
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function resolvePieColors(seriesColor, count) {
  if (seriesColor && seriesColor.includes(',')) {
    const colors = seriesColor.split(',').map((item) => item.trim()).filter(Boolean)
    if (colors.length) {
      return Array.from({ length: count }, (_, index) => colors[index % colors.length])
    }
  }
  return Array.from({ length: count }, (_, index) => PIE_COLORS[index % PIE_COLORS.length])
}

export function buildChartJsConfig(chart) {
  const labels = chart?.labels || []
  const series = chart?.series || []
  const chartType = chart?.chartType || 'bar'

  if (chartType === 'pie') {
    const values = series[0]?.data || []
    const colors = resolvePieColors(series[0]?.color, values.length)
    return {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values.map((value) => Number(value || 0)),
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const total = context.dataset.data.reduce((sum, item) => sum + Number(item || 0), 0)
                const value = Number(context.raw || 0)
                const percent = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00'
                return `${context.label}: ${formatDashboardAmount(value)} (${percent}%)`
              },
            },
          },
        },
      },
      legendItems: labels.map((label, index) => {
        const value = Number(values[index] || 0)
        const total = values.reduce((sum, item) => sum + Number(item || 0), 0)
        const percent = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00'
        return {
          label,
          color: colors[index],
          valueText: `${formatDashboardAmount(value)} (${percent}%)`,
        }
      }),
    }
  }

  return {
    type: chartType,
    data: {
      labels,
      datasets: series.map((item) => ({
        label: item.label,
        data: (item.data || []).map((value) => Number(value || 0)),
        borderColor: item.color || undefined,
        backgroundColor: item.color || undefined,
        tension: 0.2,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
    legendItems: [],
  }
}
