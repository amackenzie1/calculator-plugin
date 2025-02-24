// File: src/components/form-sections/Results.tsx
import { CalculatorSchemaType } from '@/components/Schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { downloadCSV, generateProjectionCSV } from '@/lib/utils/csv-export'
import { ArrowRightIcon, ChevronRightIcon, DownloadIcon } from 'lucide-react'
import React from 'react'
import ProjectionGraph from '../ProjectionGraph'

interface ResultsCardProps {
  projectionData: { year: number; netWorth: number }[]
  calculatorData?: CalculatorSchemaType
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  projectionData,
  calculatorData,
}) => {
  const handleDownloadCSV = () => {
    if (!calculatorData) return

    const csvContent = generateProjectionCSV(calculatorData)
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    downloadCSV(csvContent, `financial-projection-${timestamp}.csv`)
  }

  // Calculate key metrics if we have projection data
  const getKeyMetrics = () => {
    if (projectionData.length === 0) return null
    
    const currentYear = new Date().getFullYear()
    const startNetWorth = projectionData[0].netWorth
    const endNetWorth = projectionData[projectionData.length - 1].netWorth
    
    // Find data points at 10, 20, and 30 years from now
    const year10Data = projectionData.find(d => d.year === currentYear + 10)
    const year20Data = projectionData.find(d => d.year === currentYear + 20)
    const year30Data = projectionData.find(d => d.year === currentYear + 30)
    
    // Calculate compound annual growth rate (CAGR)
    const years = projectionData.length - 1
    let cagr = 0
    if (years > 0 && startNetWorth > 0 && endNetWorth > 0) {
      cagr = Math.pow(endNetWorth / startNetWorth, 1 / years) - 1
    }
    
    // Calculate total growth
    let totalGrowth = 0
    if (startNetWorth > 0) {
      totalGrowth = ((endNetWorth - startNetWorth) / startNetWorth) * 100
    }
    
    // Calculate avg yearly increase in dollars
    const avgYearlyIncrease = years > 0 ? (endNetWorth - startNetWorth) / years : 0
    
    return {
      startNetWorth,
      endNetWorth,
      year10NetWorth: year10Data?.netWorth,
      year20NetWorth: year20Data?.netWorth,
      year30NetWorth: year30Data?.netWorth,
      cagr: cagr * 100, // Convert to percentage
      totalGrowth,
      avgYearlyIncrease,
      projectionYears: years,
      endYear: projectionData[projectionData.length - 1].year
    }
  }
  
  const metrics = getKeyMetrics()
  
  // Format currency values
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }
  
  // Format compact currency (for large numbers)
  const formatCompactCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value)
  }

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="form-card-title text-primary">
              Your Financial Projection
            </CardTitle>
            <p className="text-muted-foreground">
              Based on your inputs, here's how your finances could grow over time
            </p>
          </div>
          {projectionData.length > 0 && calculatorData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
              className="flex items-center gap-2"
            >
              <DownloadIcon size={16} />
              <span>Download CSV</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="form-card-content">
        {projectionData.length > 0 && metrics ? (
          <>
            {/* Headline metrics - simplified */}
            <div className="flex justify-between items-center mb-8 bg-card rounded-lg border p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starting Net Worth</p>
                <p className="text-2xl font-bold text-primary mt-1">{formatCompactCurrency(metrics.startNetWorth)}</p>
              </div>
              
              <div className="text-center">
                <ArrowRightIcon className="inline-block h-6 w-6 text-muted-foreground mx-2" />
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Final Net Worth ({metrics.endYear})</p>
                <p className="text-2xl font-bold text-primary mt-1">{formatCompactCurrency(metrics.endNetWorth)}</p>
              </div>
            </div>
          
            {/* Graph section */}
            <ProjectionGraph data={projectionData} />
            
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2"
                size="lg"
              >
                <DownloadIcon size={16} />
                <span>Download Complete Projection Data (CSV)</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="py-16 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 border-2 border-dashed border-primary/20">
              <ChevronRightIcon size={32} className="text-primary/70" />
            </div>
            <h3 className="text-2xl font-medium">Ready to See Your Future</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fill in your financial details in the previous sections and click "Calculate Results" to view your personalized financial projection.
            </p>
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => document.querySelector('[value="general"]')?.dispatchEvent(new Event('click'))}
                className="mt-2"
              >
                Start by Adding Your Information
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ResultsCard
