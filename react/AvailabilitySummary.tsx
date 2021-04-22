/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import {
  injectIntl,
  FormattedMessage,
  WrappedComponentProps,
  defineMessages,
} from 'react-intl'
import { useLazyQuery, useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

import SIMULATE from './queries/simulate.gql'
import ORDERFORM from './queries/orderForm.gql'
import styles from './styles.css'

const prev: any = {}
const DEFAULT = {
  MAX_ITEMS: 2,
  ORDER_BY: 'faster',
  PICKUP_FIRST: true,
}

const CSS_HANDLES = [
  'container',
  'shippingOption',
  'postalCode',
  'regularShipping',
  'time',
  'ETA',
] as const

interface CheckAvailabilityProps {
  maxItems: number
  orderBy: string
  pickupFirst: boolean
}

const AvailabilitySummary: StorefrontFunctionComponent<
  WrappedComponentProps & CheckAvailabilityProps
> = ({ intl, maxItems, orderBy, pickupFirst }: any) => {
  const [getSimulation, { data, loading }] = useLazyQuery(SIMULATE)
  const { data: orderFormData, refetch } = useQuery(ORDERFORM, { ssr: false })

  const skuSelector = useProduct()
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const handleLocationUpdated = () => refetch()

    window.addEventListener('locationUpdated', handleLocationUpdated)

    return () => {
      if(Object.keys(prev).length !== 0){
        Object.keys(prev).forEach(function(key) { delete prev[key]; });
      }
      window.removeEventListener('locationUpdated', handleLocationUpdated)
    }
  }, [refetch])

  if (!skuSelector || !orderFormData) return null

  const { selectedItem, product } = skuSelector
  const hasShipping = orderFormData?.orderForm?.shippingData

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
            <FormattedMessage id="store/location-availability.shipping-label" />
          </span>{' '}
          <FormattedMessage id="store/location-availability.unavailable-message" />{' '}
          <span className={handles.postalCode}>
            {hasShipping.address.postalCode}
          </span>
        </p>
      )

    const kind: any = {}
    const structured: any = slas
      .map((option: any) => {
        return {
          price: option.price,
          isPickup: !!option.pickupStoreInfo.address,
          storeName: option.pickupStoreInfo.friendlyName,
          days: parseInt(option.shippingEstimate.replace(/\D/g, ''), 10),
        }
      })
      .sort((a: any, b: any) => {
        const a1 = a[orderBy === 'faster' ? 'days' : 'price']
        const b1 = b[orderBy === 'faster' ? 'days' : 'price']

        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
      })
      .filter(($item: any) => {
        const currKind = $item.isPickup
          ? 'pickup'
          : $item.price === 0
          ? 'free'
          : 'regular'

        if (!kind[currKind]) {
          kind[currKind] = true

          return true
        }

        return false
      })

    const pickupIndex = structured.findIndex((el: any) => {
      return el.isPickup
    })

    if (pickupIndex > -1) {
      const newIndex = pickupFirst ? 0 : structured.length - 1

      if (pickupIndex !== newIndex) {
        const [pickupItem] = structured.splice(pickupIndex, 1)

        if (newIndex > pickupIndex) {
          structured.push(pickupItem)
        } else {
          structured.unshift(pickupItem)
        }
      }
    }

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
                <FormattedMessage id="store/location-availability.store-pickup-label" />
              </span>{' '}
              <FormattedMessage id="store/location-availability.store-pickup-message" />{' '}
              {option.storeName}{' '}
              <span className={handles.ETA}>
                {option.days === 0 ? (
                  intl.formatMessage({
                    id: 'store/location-availability.today',
                  })
                ) : option.days === 1 ? (
                  intl.formatMessage({
                    id: 'store/location-availability.tomorrow',
                  })
                ) : (
                  <span className={handles.time}>
                    {intl.formatMessage({
                      id: 'store/location-availability.shipping-message-in',
                    })}{' '}
                    <span className={handles.ETA}>
                      {option.days}{' '}
                      {intl.formatMessage({
                        id: 'store/location-availability.shipping-message-days',
                      })}
                    </span>
                  </span>
                )}
              </span>
            </span>
          )}
          {!option.isPickup && !option.price && (
            <span className={`${styles.freeShipping}`}>
              <span className={styles.freeShippingLabel}>
                <FormattedMessage id="store/location-availability.free-shipping-label" />
              </span>{' '}
              <FormattedMessage id="store/location-availability.shipping-message" />{' '}
              {option.days === 1 ? (
                <span className={handles.ETA}>
                  {intl.formatMessage({
                    id: 'store/location-availability.tomorrow',
                  })}
                </span>
              ) : (
                <span className={handles.time}>
                  {intl.formatMessage({
                    id: 'store/location-availability.shipping-message-in',
                  })}{' '}
                  <span className={handles.ETA}>
                    {option.days}{' '}
                    {intl.formatMessage({
                      id: 'store/location-availability.shipping-message-days',
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
                <FormattedMessage id="store/location-availability.shipping-label" />
              </span>{' '}
              <FormattedMessage id="store/location-availability.shipping-message" />{' '}
              {option.days === 1 ? (
                <span className={handles.ETA}>
                  {intl.formatMessage({
                    id: 'store/location-availability.tomorrow',
                  })}
                </span>
              ) : (
                <span className={handles.time}>
                  {intl.formatMessage({
                    id: 'store/location-availability.shipping-message-in',
                  })}{' '}
                  <span className={handles.ETA}>
                    {option.days}{' '}
                    {intl.formatMessage({
                      id: 'store/location-availability.shipping-message-days',
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

  if (selectedItem && hasShipping) {
    const [seller] = selectedItem.sellers

    if (
      !!hasShipping?.address?.postalCode &&
      // eslint-disable-next-line no-restricted-globals
      hasShipping.address.postalCode.indexOf('*') === -1 &&
      product &&
      (!prev[product.productId] ||
        prev[product.productId] !== selectedItem.itemId)
    ) {
      prev[product.productId] = selectedItem.itemId
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

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.title',
  },
  description: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.description',
  },
  maxItems: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.maxItems.title',
  },
  orderBy: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.orderBy.title',
  },
  pickupFirst: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.pickupFirst.title',
  },
  faster: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.orderBy.faster',
  },
  cheaper: {
    defaultMessage: '',
    id:
      'admin/editor.location-availability.product-location-availability.orderBy.cheaper',
  },
})

AvailabilitySummary.schema = {
  title: messages.title,
  description: messages.description,
  type: 'object',
  properties: {
    maxItems: {
      title: messages.maxItems,
      type: 'number',
      default: 2,
      isLayout: true,
    },
    orderBy: {
      title: messages.orderBy,
      type: 'string',
      enum: ['faster', 'cheaper'],
      enumNames: [messages.faster, messages.cheaper],
      default: 'faster',
      isLayout: true,
    },
    pickupFirst: {
      title: messages.pickupFirst,
      type: 'boolean',
      default: true,
      isLayout: true,
    },
  },
}

AvailabilitySummary.defaultProps = {
  maxItems: DEFAULT.MAX_ITEMS,
  orderBy: DEFAULT.ORDER_BY,
  pickupFirst: DEFAULT.PICKUP_FIRST,
}

export default injectIntl(AvailabilitySummary)
