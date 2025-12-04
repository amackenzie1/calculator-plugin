import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SurplusCalculationResult } from "@/lib/calculator/projection/surplus"
import { Loader2, InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProjectionDataPoint, YearState } from "@/lib/calculator/projection"
import { calculateNetWorth } from "@/lib/calculator/projection/engine"
import ProjectionGraph from "@/components/ProjectionGraph"
import { CalculatorSchemaType } from "@/lib/schema/calculator"

interface SurplusCapitalCardProps {
  surplusResult?: SurplusCalculationResult
  isCalculating?: boolean
  originalProjectionData?: ProjectionDataPoint[]
  input?: CalculatorSchemaType
  projectionStates?: YearState[]
}

export function SurplusCapitalCard({ surplusResult, isCalculating, originalProjectionData, input, projectionStates }: SurplusCapitalCardProps) {
  if (isCalculating) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Calculating Capital Analysis...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Determining how much you could donate while meeting all retirement goals...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!surplusResult) {
    return null
  }

  const { 
    surplusCapital, 
    essentialCapital, 
    totalNetWorth,
    liquidAssets, 
    isViable, 
    confidenceLevel,
    postDonationProjection,
    postDonationInput,
    shortfallYear
  } = surplusResult

  const surplusPercentage = liquidAssets > 0 ? (surplusCapital / liquidAssets) * 100 : 0
  const essentialPercentage = 100 - surplusPercentage

  // Convert post-donation projection to chart data
  const postDonationData: ProjectionDataPoint[] | undefined = postDonationProjection && postDonationInput
    ? postDonationProjection.map((state) => ({
        year: state.year,
        netWorth: Math.round(calculateNetWorth(state, postDonationInput))
      }))
    : undefined

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Capital Analysis
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Shows the maximum amount you could donate or spend today while still 
                  meeting all your retirement goals and desired estate value.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isViable && shortfallYear ? (
          // Show warning if they're running out of money
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="text-red-600 mt-1">⚠️</div>
              <div>
                <div className="text-lg font-semibold text-red-800">
                  Insufficient Funds for Retirement
                </div>
                <div className="text-sm text-red-700 mt-1">
                  Your projection shows you will run out of money in year {shortfallYear}.
                  You need additional savings or reduced expenses to meet your retirement goals.
                </div>
                <div className="text-sm text-red-700 mt-2">
                  <strong>No funds are available for charitable giving</strong> until your retirement is fully funded.
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Normal display when viable
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Available for Giving</div>
              <div className="text-2xl font-bold text-green-600">
                ${surplusCapital.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Maximum donation from liquid investments
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Liquid Assets</div>
              <div className="text-2xl font-bold text-blue-600">
                ${liquidAssets.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Registered + non-registered investments
              </div>
            </div>
          </div>
        )}

        {/* Reverse Mortgage / Home Equity Breakdown - show when home borrowing is enabled */}
        {input?.allowHomeBorrowing && input?.primaryResidenceValue && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium mb-3">Home Equity Position</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primary Residence Value</span>
                <span className="font-medium">${input.primaryResidenceValue.toLocaleString()}</span>
              </div>
              {projectionStates && projectionStates.length > 0 && projectionStates[projectionStates.length - 1].liabilities.debtBalance > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Reverse Mortgage Liability (Final Year)</span>
                  <span className="font-medium">
                    -${Math.round(projectionStates[projectionStates.length - 1].liabilities.debtBalance).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-300">
                <span className="font-medium">Total Net Worth</span>
                <span className="font-bold">${totalNetWorth.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Home equity borrowing allows covering expenses when investments run out.
              Interest accrues at {input.borrowingRate || 5}% annually.
            </div>
          </div>
        )}

        {/* Visual progress bar - only show if viable */}
        {isViable && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Needed for Retirement</span>
              <span>Available to Donate</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-l-full"
                style={{ width: `${essentialPercentage}%` }}
              />
              <div
                className="bg-green-600 h-3 rounded-r-full"
                style={{ 
                  width: `${surplusPercentage}%`,
                  marginTop: '-0.75rem',
                  marginLeft: `${essentialPercentage}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Status message - only show if viable */}
        {isViable && (
          <div className={`p-3 rounded-lg ${
            surplusCapital > 0 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className={`text-sm font-medium ${
              surplusCapital > 0 
                ? 'text-green-800' 
                : 'text-yellow-800'
            }`}>
              {surplusCapital === 0
                ? 'All liquid assets are essential for meeting retirement goals'
                : `You could donate up to $${surplusCapital.toLocaleString()} from your liquid investments today and still meet all your retirement goals`
              }
            </div>
            
            {surplusCapital > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Calculation confidence: {(confidenceLevel * 100).toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {/* Projection graph - always show, but with overlay only when there's surplus */}
        {originalProjectionData && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">
                {surplusCapital > 0 ? 'Projection Comparison' : 'Net Worth Projection'}
              </h4>
            </div>
            <div className="relative">
              <ProjectionGraph 
                data={originalProjectionData} 
                overlayData={surplusCapital > 0 ? postDonationData : undefined}
                overlayLabel="After Max Donation"
              />
            </div>
            {surplusCapital > 0 && postDonationData && (
              <div className="text-xs text-muted-foreground">
                <span className="text-blue-600">■</span> Current projection &nbsp;&nbsp;
                <span className="text-green-600">■</span> After donating ${surplusCapital.toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Disclaimers */}
        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          {!isViable ? (
            <>
              <div>• Consider increasing savings or reducing expenses</div>
              <div>• Review your retirement age and estate goals</div>
              <div>• Consult a financial advisor to improve your retirement plan</div>
            </>
          ) : (
            <>
              <div>• Only liquid investments (TFSA, RRSP, RRIF, etc.) can be donated immediately</div>
              <div>• Your primary residence remains untouched in this calculation</div>
              <div>• This assumes average market returns and inflation rates</div>
              <div>• Consider keeping a safety buffer for unexpected expenses</div>
              <div>• Consult a financial advisor before making large donations</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}