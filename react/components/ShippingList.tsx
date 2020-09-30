import React, { Fragment, FunctionComponent } from 'react'

import ShippingListItem from './ShippingListItem'

interface ShippingListProps {
  slas: SLA[]
}

interface SLA {
  id: string
  friendlyName: string
  price: number
  shippingEstimate: string
}

const ShippingList: FunctionComponent<ShippingListProps> = ({ slas }) => {
  return (
    <Fragment>
      {slas.map((shippingItem: SLA) => (
        <ShippingListItem
          key={shippingItem.id}
          name={shippingItem.friendlyName}
          shippingEstimate={shippingItem.shippingEstimate}
          price={shippingItem.price}
        />
      ))}
    </Fragment>
  )
}

export default ShippingList
