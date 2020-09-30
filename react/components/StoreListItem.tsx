import React, { FC } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { FormattedMessage } from 'react-intl'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'estimateTranslated',
  'pickupItem',
  'pickupName',
  'pickupAddress',
  'pickupCityStateZip',
  'pickupEstimate',
  'pickupUnavailable',
] as const

interface Props {
  store: SLA
}

const StorePickupItem: FC<Props> = ({ store }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    pickupStoreInfo: { address, friendlyName },
    shippingEstimate,
  } = store

  const estimate = shippingEstimate && (
    <div className={`${handles.estimateTranslated} ml2`}>
      <TranslateEstimate shippingEstimate={shippingEstimate} isPickup />
    </div>
  )

  return (
    <div
      className={`flex flex-column t-body lh-copy c-muted-2 mb3 ${handles.pickupItem}`}
    >
      <div
        className={`t-heading-6 c-on-base ${handles.pickupName}`}
      >{`${friendlyName}`}</div>
      <div className={handles.pickupAddress}>{`${
        address.number ? `${address.number} ` : ''
      }${address.street}`}</div>
      <div
        className={handles.pickupCityStateZip}
      >{`${address.city}, ${address.state}, ${address.postalCode}`}</div>
      <div
        className={`${
          shippingEstimate
            ? applyModifiers(handles.pickupEstimate, shippingEstimate)
            : handles.pickupUnavailable
        } flex`}
      >
        {shippingEstimate ? (
          <FormattedMessage
            id="store/location-availability.pickup-availability.pickup-estimate"
            values={{ estimate }}
          />
        ) : (
          <FormattedMessage id="store/location-availability.pickup-availability.pickup-unavailable" />
        )}
      </div>
    </div>
  )
}

export default StorePickupItem
