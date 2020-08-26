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

  const buildResponse = (item: any) => {
    const [status] = item.items
    const [logistics] = item.logisticsInfo
    const { availability } = status
    const { slas } = logistics

    if (availability === 'withoutStock') return

    const structured = slas
      .sort((a: any, b: any) => {
        const a1 = parseInt(a.shippingEstimate.replace(/\D/g, ''), 10)
        const b1 = parseInt(b.shippingEstimate.replace(/\D/g, ''), 10)

        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
      })
      .map((option: any) => {
        return {
          ...option,
          isPickup: !!option.pickupStoreInfo.address,
          storeName: option.pickupStoreInfo.friendlyName,
          days: parseInt(option.shippingEstimate.replace(/\D/g, ''), 10),
        }
      })

    return structured.map((option: any, i: number) => {
      return (
        <p
          key={`slaInfo_${new Date().getTime()}_${i}`}
          className={`ma0 ${
            !i ? 'firstShippingOption' : ''
          } slaInfo_position_${i} ${i > 1 ? 'dn' : ''}`}
        >
          {option.isPickup && (
            <span className="pickUp">Pickup today at {option.storeName}</span>
          )}
          {!option.isPickup && !option.price && (
            <span className="freeShipping">
              FREE shipping: Get it{' '}
              {option.days === 1 ? 'tomorrow' : `in ${option.days} days`}
            </span>
          )}
          {!option.isPickup && option.price && (
            <span className={option.days === 1 ? 'getTomorrow' : 'getInDays'}>
              Get it {option.days === 1 ? 'tomorrow' : `in ${option.days} days`}
            </span>
          )}
        </p>
      )
    })
  }

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

  return data?.shipping?.items && !loading ? (
    <div> {buildResponse(data.shipping)}</div>
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
