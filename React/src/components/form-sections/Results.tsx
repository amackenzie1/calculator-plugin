// File: src/components/form-sections/Results.tsx
import { CalculatorSchemaType } from '@/components/Schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { downloadCSV, generateProjectionCSV } from '@/lib/utils/csv-export'
import { DownloadIcon } from 'lucide-react'
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
    const cagr = years > 0 ? Math.pow(endNetWorth / startNetWorth, 1 / years) - 1 : 0
    
    return {
      startNetWorth,
      endNetWorth,
      year10NetWorth: year10Data?.netWorth,
      year20NetWorth: year20Data?.netWorth,
      year30NetWorth: year30Data?.netWorth,
      cagr: cagr * 100, // Convert to percentage
      projectionYears: years
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

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <div className="flex justify-between items-center">
          <CardTitle className="form-card-title text-primary">
            Results
          </CardTitle>
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
        {projectionData.length > 0 ? (
          <>
            <ProjectionGraph data={projectionData} />
            
            {metrics && (
              <div className="mt-8 border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Key Financial Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Net Worth</p>
                    <p className="text-lg font-medium">{formatCurrency(metrics.startNetWorth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Final Net Worth</p>
                    <p className="text-lg font-medium">{formatCurrency(metrics.endNetWorth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Annual Growth</p>
                    <p className="text-lg font-medium">{metrics.cagr.toFixed(2)}%</p>
                  </div>
                  
                  {metrics.year10NetWorth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Net Worth in 10 Years</p>
                      <p className="text-lg font-medium">{formatCurrency(metrics.year10NetWorth)}</p>
                    </div>
                  )}
                  
                  {metrics.year20NetWorth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Net Worth in 20 Years</p>
                      <p className="text-lg font-medium">{formatCurrency(metrics.year20NetWorth)}</p>
                    </div>
                  )}
                  
                  {metrics.year30NetWorth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Net Worth in 30 Years</p>
                      <p className="text-lg font-medium">{formatCurrency(metrics.year30NetWorth)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Download the CSV file for a detailed breakdown of your financial
              projection.
            </p>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Please submit the form to see your results.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default ResultsCard
