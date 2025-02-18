import React from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ProjectionDataPoint {
  year: number
  netWorth: number
}

interface ProjectionGraphProps {
  data: ProjectionDataPoint[]
}

const ProjectionGraph: React.FC<ProjectionGraphProps> = ({ data }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Net Worth Projection
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProjectionGraph
