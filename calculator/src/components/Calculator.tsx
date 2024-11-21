import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const Calculator = () => {
  const [income, setIncome] = useState<number>(50000)
  const [deductions, setDeductions] = useState<number>(5000)
  const [taxRate, setTaxRate] = useState<number>(25)

  // Mock data for the chart
  const chartData = [
    { month: 'Jan', tax: 2100 },
    { month: 'Feb', tax: 2300 },
    { month: 'Mar', tax: 2000 },
    { month: 'Apr', tax: 2780 },
    { month: 'May', tax: 1890 },
    { month: 'Jun', tax: 2390 },
  ]

  // Additional mock data for the bar chart
  const barChartData = [
    { month: 'Jan', savings: 400 },
    { month: 'Feb', savings: 300 },
    { month: 'Mar', savings: 500 },
    { month: 'Apr', savings: 200 },
    { month: 'May', savings: 700 },
    { month: 'Jun', savings: 600 },
  ]

  return (
    <div className="[&_*]:!rounded-[var(--radius)]">
      <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="text-right !rounded-[var(--radius)] [&]:rounded-[var(--radius)]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tax Rate</Label>
                <Slider
                  value={[taxRate]}
                  onValueChange={(value) => setTaxRate(value[0])}
                  max={100}
                  step={1}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {taxRate}%
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxYear">Tax Year</Label>
                <Select defaultValue="2024">
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deductions">Total Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="text-right"
                />
              </div>

              <Card className="bg-black/5">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Taxable Income:</span>
                      <span className="font-semibold">
                        ${(income - deductions).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax:</span>
                      <span className="font-semibold text-primary">
                        $
                        {(
                          ((income - deductions) * taxRate) /
                          100
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tax"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip />
                  <Bar dataKey="savings" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Calculator
