import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useSimpleLocationState } from './context/SimpleLocationContext'
import StoreList from './components/StoreList'
import SeeAllStoresModal from './components/SeeAllStoresModal'

const MAX_ITEMS = 3
const CSS_HANDLES = [
  'storeListContainer',
  'storeListEmptyMessage',
  'pickupHeader',
  'storeList',
] as const

const Wrapper: FunctionComponent<{ handles: Record<string, string> }> = ({
  children,
  handles,
}) => (
  <div
    className={`flex flex-column flex-grow-1 mv5 ${handles.storeListContainer}`}
  >
    {children}
  </div>
)

const PickupAvailability: FunctionComponent = () => {
  const { pickupSlas } = useSimpleLocationState()
  const handles = useCssHandles(CSS_HANDLES)

  const Header = (
    <div className={`${handles.pickupHeader} mb3 c-muted-2 t-heading-5`}>
      <FormattedMessage id="store/location-availability.pickup-availability.available-header" />
    </div>
  )

  if (!pickupSlas.length) {
    return (
      <Wrapper handles={handles}>
        {Header}
        <div
          className={`t-body c-muted-2 mv3 ${handles.storeListEmptyMessage}`}
        >
          <FormattedMessage id="store/location-availability.pickup-availability.empty-list" />
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper handles={handles}>
      {Header}
      <div className={handles.storeList}>
        <StoreList stores={pickupSlas} maxItems={MAX_ITEMS} />
      </div>
      <SeeAllStoresModal minimumItems={MAX_ITEMS + 1} stores={pickupSlas} />
    </Wrapper>
  )
}

export default PickupAvailability
