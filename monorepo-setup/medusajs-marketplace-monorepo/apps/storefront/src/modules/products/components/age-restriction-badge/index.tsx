import { Badge, Text } from '@medusajs/ui'

type AgeRestrictionBadgeProps = {
  minimumAge?: number
  size?: 'small' | 'large'
  className?: string
}

const AgeRestrictionBadge = ({ 
  minimumAge = 21, 
  size = 'small',
  className = '' 
}: AgeRestrictionBadgeProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        color="red" 
        className={size === 'large' ? 'px-3 py-1.5' : 'px-2 py-1'}
      >
        <span className={size === 'large' ? 'text-sm' : 'text-xs'}>
          {minimumAge}+
        </span>
      </Badge>
      {size === 'large' && (
        <Text className="text-sm text-gray-600">
          Age verification required at checkout
        </Text>
      )}
    </div>
  )
}

export default AgeRestrictionBadge