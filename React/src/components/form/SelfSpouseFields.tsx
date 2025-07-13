import { ReactNode } from 'react'

interface SelfSpouseFieldsProps {
  calculateForSpouse: boolean
  selfContent: ReactNode
  spouseContent: ReactNode
  layout?: 'row' | 'column'
}

export function SelfSpouseFields({ 
  calculateForSpouse, 
  selfContent, 
  spouseContent,
  layout = 'row'
}: SelfSpouseFieldsProps) {
  if (layout === 'column') {
    return (
      <div className="space-y-6">
        <div>{selfContent}</div>
        {calculateForSpouse && <div>{spouseContent}</div>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>{selfContent}</div>
      {calculateForSpouse && <div>{spouseContent}</div>}
    </div>
  )
}