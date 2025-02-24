import React, { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface ProjectionDataPoint {
  year: number
  netWorth: number
}

interface ProjectionGraphProps {
  data: ProjectionDataPoint[]
}

const ProjectionGraph: React.FC<ProjectionGraphProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area')

  // Get current year to highlight on chart
  const currentYear = new Date().getFullYear()
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value)
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-md border">
          <CardContent className="p-0">
            <p className="text-sm font-medium">Year: {label}</p>
            <p className="text-primary font-semibold">
              Net Worth: {formatCurrency(payload[0].value)}
            </p>
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
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
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
                name="Net Worth"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 2, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
              {/* Reference line for current year */}
              <CartesianGrid 
                vertical={false} 
                horizontal={true} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
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
                name="Net Worth"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 25%)"
                strokeWidth={2.5}
                activeDot={{ r: 7, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
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
                name="Net Worth"
                fill="hsl(var(--primary) / 80%)"
                radius={[4, 4, 0, 0]}
              />
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
