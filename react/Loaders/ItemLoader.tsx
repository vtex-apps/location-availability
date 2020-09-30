import React, { FC, Fragment } from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'

import { useShowWithDelay } from '../hooks/useShowWithDelay'

interface Props {
  header?: JSX.Element
}

const ItemLoader: FC<Props> = ({ header }) => {
  const canShow = useShowWithDelay()

  if (!canShow) {
    return (
      <div className="w-100" style={{ height: 80 }} data-testid="item-loader" />
    )
  }

  return (
    <Fragment>
      {header}
      <div style={{ marginLeft: '10px' }}>
        <RectShape color="#f3f3f3" style={{ height: 28, width: '160px' }} />
        <RectShape
          color="#f3f3f3"
          style={{ height: 22, width: '200px', marginTop: '6px' }}
        />
        <RectShape
          color="#f3f3f3"
          style={{ height: 22, width: '200px', marginTop: '6px' }}
        />
      </div>
    </Fragment>
  )
}

export default ItemLoader
