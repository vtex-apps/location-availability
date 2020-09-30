declare module 'vtex.shipping-estimate-translator/TranslateEstimate' {
  import { ComponentType } from 'react'

  interface Props {
    shippingEstimate: string
    isPickup?: boolean
  }

  const TranslateEstimate: ComponentType<Props>
  export default TranslateEstimate
}
