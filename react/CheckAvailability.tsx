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
const DEFAULT_MAX_ITEMS = 2
const CSS_HANDLES = [
  'container',
  'shippingOption',
  'postalCode',
  'regularShipping',
  'time',
  'ETA',
] as const

const CheckAvailability: FC<WrappedComponentProps & any> = ({
  intl,
  orderForm,
  maxItems,
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
        <p className={`${styles.cannotBeDelivered} ${handles.shippingOption}`}>
          <span className={`${styles.cannotBeDeliveredLabel}`}>
            <FormattedMessage id="store/shipping-label" />
          </span>{' '}
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
      return i < maxItems ? (
        <p
          key={`slaInfo_${new Date().getTime()}_${i}`}
          className={`ma0 ${handles.shippingOption} ${
            !i ? `${styles.firstShippingOption}` : ''
          } vtex-slaInfo_position_${i}`}
        >
          {option.isPickup && (
            <span className={`${styles.pickUp}`}>
              <span className={`${styles.pickUpLabel}`}>
                <FormattedMessage id="store/store-pickup-label" />
              </span>{' '}
              <FormattedMessage id="store/store-pickup-message" />{' '}
              {option.storeName}{' '}
              <span className={handles.ETA}>
                {option.days === 0
                  ? intl.formatMessage({
                      id: 'store/today',
                    })
                  : intl.formatMessage({
                      id: 'store/tomorrow',
                    })}
              </span>
            </span>
          )}
          {!option.isPickup && !option.price && (
            <span className={`${styles.freeShipping}`}>
              <span className={styles.freeShippingLabel}>
                <FormattedMessage id="store/free-shipping-label" />
              </span>{' '}
              <FormattedMessage id="store/shipping-message" />{' '}
              {option.days === 1 ? (
                <span className={handles.ETA}>
                  {intl.formatMessage({
                    id: 'store/tomorrow',
                  })}
                </span>
              ) : (
                <span className={handles.time}>
                  {intl.formatMessage({
                    id: 'store/shipping-message-in',
                  })}{' '}
                  <span className={handles.ETA}>
                    {option.days}{' '}
                    {intl.formatMessage({
                      id: 'store/shipping-message-days',
                    })}
                  </span>
                </span>
              )}
            </span>
          )}
          {!option.isPickup && !!option.price && (
            <span
              className={`${handles.regularShipping} ${
                option.days === 1
                  ? `${styles.getTomorrow}`
                  : `${styles.getInDays}`
              }`}
            >
              <span className={styles.regularShippingLabel}>
                <FormattedMessage id="store/shipping-label" />
              </span>{' '}
              <FormattedMessage id="store/shipping-message" />{' '}
              {option.days === 1 ? (
                <span className={handles.ETA}>
                  {intl.formatMessage({
                    id: 'store/tomorrow',
                  })}
                </span>
              ) : (
                <span className={handles.time}>
                  {intl.formatMessage({
                    id: 'store/shipping-message-in',
                  })}{' '}
                  <span className={handles.ETA}>
                    {option.days}{' '}
                    {intl.formatMessage({
                      id: 'store/shipping-message-days',
                    })}
                  </span>
                </span>
              )}
            </span>
          )}
        </p>
      ) : (
        ''
      )
    })
  }

  console.log('selectedItem =>', selectedItem)

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
    <div className={handles.container}> {buildResponse(data.shipping)}</div>
  ) : null
}

CheckAvailability.defaultProps = {
  maxItems: DEFAULT_MAX_ITEMS,
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
