import { InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface FormSectionProps {
  title: string
  description?: string
  tooltip?: string
  children: ReactNode
}

export function FormSection({ title, description, tooltip, children }: FormSectionProps) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">{title}</h3>
      {(description || tooltip) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground mb-4 cursor-help flex items-center">
                {description || 'More information'} <InfoIcon className="h-4 w-4 ml-1" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip || description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {children}
    </div>
  )
}