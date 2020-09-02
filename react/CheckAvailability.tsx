/* eslint-disable no-console */
import React from 'react'
import {
  injectIntl,
  FormattedMessage,
  WrappedComponentProps,
  defineMessages,
} from 'react-intl'
import { useLazyQuery, graphql, compose } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
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
  orderForm: any
  maxItems: number
  orderBy: string
  pickupFirst: boolean
}

const CheckAvailability: StorefrontFunctionComponent<
  WrappedComponentProps & CheckAvailabilityProps
> = ({ intl, orderForm, maxItems, orderBy, pickupFirst }: any) => {
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

  // Listen to address changes from the app vtex.shopper-location
  window.addEventListener('locationUpdated', () => {
    orderForm.refetch()
  })

  return data?.shipping?.items && !loading ? (
    <div className={handles.container}> {buildResponse(data.shipping)}</div>
  ) : null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.description',
  },
  maxItems: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.maxItems.title',
  },
  orderBy: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.orderBy.title',
  },
  pickupFirst: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.pickupFirst.title',
  },
  faster: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.orderBy.faster',
  },
  cheaper: {
    defaultMessage: '',
    id: 'admin/editor.product-location-availability.orderBy.cheaper',
  },
})

CheckAvailability.schema = {
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

CheckAvailability.defaultProps = {
  maxItems: DEFAULT.MAX_ITEMS,
  orderBy: DEFAULT.ORDER_BY,
  pickupFirst: DEFAULT.PICKUP_FIRST,
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
