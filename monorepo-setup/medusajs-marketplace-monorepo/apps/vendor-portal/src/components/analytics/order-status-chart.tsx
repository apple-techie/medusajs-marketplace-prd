'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type OrderStatusChartProps = {
  data: {
    pending: number
    processing: number
    completed: number
    canceled: number
  }
}

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = {
    labels: ['Pending', 'Processing', 'Completed', 'Canceled'],
    datasets: [
      {
        data: [data.pending, data.processing, data.completed, data.canceled],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // Yellow for pending
          'rgba(59, 130, 246, 0.8)',  // Blue for processing
          'rgba(16, 185, 129, 0.8)',  // Green for completed
          'rgba(239, 68, 68, 0.8)',   // Red for canceled
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    },
  }

  const totalOrders = data.pending + data.processing + data.completed + data.canceled

  return (
    <div className="space-y-4">
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
        <p className="text-sm text-gray-500">Total Orders</p>
      </div>
    </div>
  )
}