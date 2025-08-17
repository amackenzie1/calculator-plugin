import React, { useState } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

interface ProjectionDataPoint {
  year: number
  netWorth: number
}

interface ProjectionGraphProps {
  data: ProjectionDataPoint[]
  overlayData?: ProjectionDataPoint[]
  overlayLabel?: string
}

const ProjectionGraph: React.FC<ProjectionGraphProps> = ({ data, overlayData, overlayLabel }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')

  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency', 
      currency: 'CAD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value)
  }

  // Merge data for overlay charts
  const mergedData = data.map(point => {
    const overlayPoint = overlayData?.find(overlay => overlay.year === point.year)
    return {
      year: point.year,
      netWorth: point.netWorth,
      overlayNetWorth: overlayPoint?.netWorth
    }
  })

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-md border">
          <CardContent className="p-0">
            <p className="text-sm font-medium">Year: {label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} className="font-semibold" style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
          </CardContent>
        </Card>
      )
    }
    return null
  }

  return (
    <div className="projection-graph">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Net Worth Projection
        </h2>
        <div className="flex items-center mt-4 md:mt-0">
          <Tabs defaultValue="area" onValueChange={(v) => setChartType(v as any)}>
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="h-[400px]">
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="netWorth"
                name="Current Projection"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 2, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
              {overlayData && (
                <Line
                  type="monotone"
                  dataKey="overlayNetWorth"
                  name={overlayLabel || "Post-Donation"}
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2, fill: '#22c55e' }}
                  activeDot={{ r: 6, fill: '#22c55e' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mergedData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis 
                dataKey="year" 
                tick={{ fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
                tickCount={5}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="netWorth"
                name="Current Projection"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 25%)"
                strokeWidth={2.5}
                activeDot={{ r: 7, fill: 'hsl(var(--primary))' }}
              />
              {overlayData && (
                <Area
                  type="monotone"
                  dataKey="overlayNetWorth"
                  name={overlayLabel || "Post-Donation"}
                  stroke="#22c55e"
                  fill="rgba(34, 197, 94, 0.1)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  activeDot={{ r: 6, fill: '#22c55e' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mergedData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="netWorth"
                name="Current Projection"
                fill="hsl(var(--primary) / 80%)"
                radius={[4, 4, 0, 0]}
              />
              {overlayData && (
                <Bar
                  dataKey="overlayNetWorth"
                  name={overlayLabel || "Post-Donation"}
                  fill="rgba(34, 197, 94, 0.6)"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="text-sm text-muted-foreground mt-4 text-center">
        <p>Displaying projected net worth over time. Switch between chart types to visualize your financial journey.</p>
      </div>
    </div>
  )
}

export default ProjectionGraph
