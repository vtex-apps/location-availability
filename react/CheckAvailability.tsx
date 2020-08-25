/* eslint-disable no-console */
import React, { FC, useContext } from 'react'
import { injectIntl } from 'react-intl'
import { useLazyQuery, graphql, compose } from 'react-apollo'
import { ProductContext } from 'vtex.product-context'

import SIMULATE from './queries/simulate.gql'
import ORDERFORM from './queries/orderForm.gql'

const CheckAvailability: FC<any> = ({ orderForm }) => {
  const { product } = useContext(ProductContext) as any

  const [getSimulation, { data, loading, called }] = useLazyQuery(SIMULATE)

  const hasShipping = orderForm?.orderForm?.shippingData

  if (product && hasShipping && !called) {
    getSimulation({
      variables: {
        items: [
          {
            id: product.sku.itemId,
            seller: product.sku.seller.sellerId,
            quantity: '1',
          },
        ],
        postalCode: hasShipping.address.postalCode,
        country: hasShipping.address.country,
      },
    })
  }

  if (data?.shipping?.items) {
    console.log('HAS =>', hasShipping.address.postalCode, data.shipping)
  }

  return data?.shipping?.items && !loading ? (
    <div> {data.shipping.items[0].availability}</div>
  ) : null
}

export default injectIntl(
  compose(
    graphql(ORDERFORM, {
      name: 'orderForm',
      options: {
        ssr: false,
      },
    })
  )(CheckAvailability)
)
