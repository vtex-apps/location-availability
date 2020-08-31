/* eslint-disable no-console */
import React, { FC } from 'react'
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl'
import { useLazyQuery, graphql, compose } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import { useCssHandles } from 'vtex.css-handles'

import SIMULATE from './queries/simulate.gql'
import ORDERFORM from './queries/orderForm.gql'
import styles from './styles.css'

const prev: any = {}
const CSS_HANDLES = [
  'shippingOption',
  'cannotBeDelivered',
  'cannotBeDeliveredBold',
  'postalCode',
  'fistShippingOption',
  'pickUp',
  'pickUpStrong',
  'freeShipping',
  'freeShippingStrong',
  'regularShipping',
  'regularShippingStrong',
  'regularShippingGetInDays',
  'regularShippingGetTomorrow',
] as const

const CheckAvailability: FC<WrappedComponentProps & any> = ({
  intl,
  orderForm,
}) => {
  const [getSimulation, { data, loading }] = useLazyQuery(SIMULATE)

  const skuSelector = useProduct()
  const handles = useCssHandles(CSS_HANDLES)

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
        <p
          className={`${styles.cannotBeDelivered} ${handles.shippingOption} ${handles.cannotBeDelivered}`}
        >
          <strong
            className={`${styles.cannotBeDeliveredBold} ${handles.cannotBeDeliveredBold}`}
          >
            <FormattedMessage id="store/shipping-label" />
          </strong>{' '}
          <FormattedMessage id="store/unavailable-message" />{' '}
          <span className={handles.postalCode}>
            {hasShipping.address.postalCode}
          </span>
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
          key={`${handles.shippingOption} slaInfo_${new Date().getTime()}_${i}`}
          className={`ma0 ${
            !i
              ? `${styles.fistShippingOption} ${handles.fistShippingOption}`
              : ''
          } slaInfo_position_${i} ${i > 1 ? 'dn' : ''}`}
        >
          {option.isPickup && (
            <span className={`${styles.pickUp} ${handles.pickUp}`}>
              <strong className={`${handles.pickUpStrong}`}>
                <FormattedMessage id="store/store-pickup-label" />
              </strong>{' '}
              <FormattedMessage id="store/store-pickup-message" />{' '}
              {option.storeName}{' '}
              {option.days === 0
                ? intl.formatMessage({
                    id: 'store/today',
                  })
                : intl.formatMessage({
                    id: 'store/tomorrow',
                  })}
            </span>
          )}
          {!option.isPickup && !option.price && (
            <span className={`${styles.freeShipping} ${handles.freeShipping}`}>
              <strong className={handles.freeShippingStrong}>
                <FormattedMessage id="store/free-shipping-label" />
              </strong>{' '}
              <FormattedMessage id="store/shipping-message" />{' '}
              {option.days === 1
                ? intl.formatMessage({
                    id: 'store/tomorrow',
                  })
                : `${intl.formatMessage({
                    id: 'store/shipping-message-in',
                  })} ${option.days} ${intl.formatMessage({
                    id: 'store/shipping-message-days',
                  })}`}
            </span>
          )}
          {!option.isPickup && !!option.price && (
            <span
              className={`${handles.regularShipping} ${
                option.days === 1
                  ? `${styles.getTomorrow} ${handles.regularShippingGetTomorrow}`
                  : `${styles.getInDays} ${handles.regularShippingGetInDays}`
              }`}
            >
              <strong className={handles.regularShippingStrong}>
                <FormattedMessage id="store/shipping-label" />
              </strong>{' '}
              <FormattedMessage id="store/shipping-message" />{' '}
              {option.days === 1
                ? intl.formatMessage({
                    id: 'store/tomorrow',
                  })
                : `${intl.formatMessage({
                    id: 'store/shipping-message-in',
                  })} ${option.days} ${intl.formatMessage({
                    id: 'store/shipping-message-days',
                  })}`}
            </span>
          )}
        </p>
      )
    })
  }

  if (selectedItem && hasShipping) {
    const [seller] = selectedItem.sellers

    if (
      // eslint-disable-next-line no-restricted-globals
      !isNaN(hasShipping.address.postalCode) &&
      (!prev[product.prodictId] ||
        prev[product.prodictId] !== selectedItem.itemId)
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
