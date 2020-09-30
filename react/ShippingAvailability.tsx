import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useSimpleLocationState } from './context/SimpleLocationContext'
import ShippingList from './components/ShippingList'

const CSS_HANDLES = [
  'shippingListContainer',
  'shippingHeader',
  'shippingListEmptyMessage',
  'shippingList',
] as const

const Wrapper: FunctionComponent<{ handles: Record<string, string> }> = ({
  children,
  handles,
}) => (
  <div
    className={`flex flex-column flex-grow-1 mv5 ${handles.shippingListContainer}`}
  >
    {children}
  </div>
)

const ShippingAvailability: FunctionComponent = () => {
  const { shippingSlas } = useSimpleLocationState()
  const handles = useCssHandles(CSS_HANDLES)

  const Header = (
    <div className={`${handles.shippingHeader} mb3 c-muted-2 t-heading-5`}>
      <FormattedMessage id="store/location-availability.shipping-availability.available-header" />
    </div>
  )

  if (!shippingSlas.length) {
    return (
      <Wrapper handles={handles}>
        {Header}
        <div
          className={`t-body c-muted-2 mv3 ${handles.shippingListEmptyMessage}`}
        >
          <FormattedMessage id="store/location-availability.shipping-availability.empty-list" />
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper handles={handles}>
      {Header}
      <div className={handles.shippingList}>
        <ShippingList slas={shippingSlas} />
      </div>
    </Wrapper>
  )
}

export default ShippingAvailability
