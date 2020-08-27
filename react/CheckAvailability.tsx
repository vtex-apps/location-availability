/* eslint-disable no-console */
import React, { FC } from 'react'
import { injectIntl } from 'react-intl'
import { useLazyQuery, graphql, compose } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'

import SIMULATE from './queries/simulate.gql'
import ORDERFORM from './queries/orderForm.gql'

const prev: any = {}

const CheckAvailability: FC<any> = ({ orderForm }) => {
  const [getSimulation, { data, loading }] = useLazyQuery(SIMULATE)
  const skuSelector = useProduct()

  if (!skuSelector || !orderForm) return null

  const { selectedItem, product } = skuSelector
  const hasShipping = orderForm?.orderForm?.shippingData

  const buildResponse = (item: any) => {
    const [status] = item.items
    const [logistics] = item.logisticsInfo
    const { availability } = status
    const { slas } = logistics

    if (availability === 'withoutStock') return
    if (availability === 'cannotBeDelivered')
      return (
        <p className="cannotBeDelivered">
          Cannot be delivered to your location
        </p>
      )

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

  if (selectedItem && hasShipping) {
    const [seller] = selectedItem.sellers

    if (
      !prev[product.prodictId] ||
      prev[product.prodictId] !== selectedItem.itemId
    ) {
      prev[product.prodictId] = selectedItem.itemId
      getSimulation({
        variables: {
          items: [
            {
              id: selectedItem.itemId,
              seller: seller.sellerId,
              quantity: '1',
            },
          ],
          postalCode: hasShipping.address.postalCode,
          country: hasShipping.address.country,
        },
      })
    }
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
