// File: src/components/form-sections/Results.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ProjectionGraph from '../ProjectionGraph'

interface ResultsCardProps {
  projectionData: { year: number; netWorth: number }[]
}

const ResultsCard: React.FC<ResultsCardProps> = ({ projectionData }) => {
  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">Results</CardTitle>
      </CardHeader>
      <CardContent className="form-card-content">
        {projectionData.length > 0 ? (
          <ProjectionGraph data={projectionData} />
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
