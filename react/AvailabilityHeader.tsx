import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useSimpleLocationState } from './context/SimpleLocationContext'

const CSS_HANDLES = ['availabilityHeader'] as const

const AvailabilityHeader: FunctionComponent = () => {
  const { location } = useSimpleLocationState()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.availabilityHeader} t-heading-4`}>
      <FormattedMessage
        id="store/location-availability.availability-header"
        values={{ postalCode: location.postalCode }}
      />
    </div>
  )
}

export default AvailabilityHeader
