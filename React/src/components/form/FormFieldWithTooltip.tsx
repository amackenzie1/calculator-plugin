import { InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FormLabel } from '@/components/ui/form'

interface FormFieldWithTooltipProps {
  label: string
  tooltip: string
  children?: ReactNode
}

export function FormFieldWithTooltip({ label, tooltip, children }: FormFieldWithTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      {children ? (
        children
      ) : (
        <FormLabel>{label}</FormLabel>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="cursor-help text-muted-foreground h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}