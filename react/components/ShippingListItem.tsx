import React, { FunctionComponent } from 'react'
import { useIntl } from 'react-intl'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
  name: string
  shippingEstimate: string
  price: number
}

const CSS_HANDLES = [
  'shippingListItem',
  'shippingDeliveryName',
  'shippingDeliveryEstimate',
  'shippingDeliveryPrice',
] as const

const ShippingTableRow: FunctionComponent<Props> = ({
  name,
  shippingEstimate,
  price,
}) => {
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  let valueText

  if (typeof price === 'undefined') {
    valueText = '-'
  } else if (price === 0) {
    valueText = formatMessage({
      id: 'store/location-availability.shipping-availability.free',
    })
  } else {
    valueText = <FormattedCurrency value={price / 100} />
  }

  return (
    <div
      className={`${handles.shippingListItem} flex flex-column t-body lh-copy c-muted-2 mb3`}
      key={name}
    >
      <div className={`t-heading-6 c-on-base ${handles.shippingDeliveryName}`}>
        {name}
      </div>
      <div className={`${handles.shippingDeliveryEstimate}`}>
        <TranslateEstimate shippingEstimate={shippingEstimate} />
      </div>
      <div className={`${handles.shippingDeliveryPrice}`}>{valueText}</div>
    </div>
  )
}

export default ShippingTableRow
