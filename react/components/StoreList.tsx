import React, { Fragment, FunctionComponent } from 'react'

import StoreListItem from './StoreListItem'

interface Props {
  stores: SLA[]
  maxItems?: number
}

const StoreList: FunctionComponent<Props> = ({ stores, maxItems }) => {
  const items =
    maxItems && stores.length > maxItems ? stores.slice(0, maxItems) : stores

  return (
    <Fragment>
      {items.map((store) => {
        return <StoreListItem key={store.id} store={store} />
      })}
    </Fragment>
  )
}

export default StoreList
