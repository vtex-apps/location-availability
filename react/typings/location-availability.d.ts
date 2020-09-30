interface CheckoutAddress {
  street: string
  number: string
  addressId: string
  complement: string
  country: string
  geoCoordinates: [number, number]
  neighborhood: string
  postalCode: string
  state: string
  city: string
}

type SessionAddress = Omit<CheckoutAddress, 'geoCoordinates'> & {
  geoCoordinate: [number, number]
}

interface SkuPickupStore {
  cacheId: string
  id: string
  shippingEstimate: string | null
  pickupStoreInfo: PickupStore
}

interface PickupStore {
  friendlyName: string
  address: CheckoutAddress
}

interface FavoritePickup {
  name: string
  address: CheckoutAddress
}

interface SimpleLocation {
  lat: string
  long: string
  postalCode: string
  country: string
}

interface SLA {
  id: string
  friendlyName: string
  price: number
  shippingEstimate: string
  pickupStoreInfo: PickupStore
}

interface SimpleLocationContextProps {
  location: SimpleLocation
  pickupSlas: SLA[]
  shippingSlas: SLA[]
}
