import React, { FC, useState, Fragment } from 'react'
import { Button, Modal } from 'vtex.styleguide'
import { useDevice } from 'vtex.device-detector'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import StoreList from './StoreList'

const CSS_HANDLES = [
  'seeAllModalButton',
  'seeAllModalButtonText',
  'modalContainer',
  'modalHeader',
  'modalStoreList',
] as const

interface Props {
  stores: SLA[] | undefined
  minimumItems: number
}

const SeeAllStoresModal: FC<Props> = ({ stores, minimumItems }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const { isMobile } = useDevice()
  const handles = useCssHandles(CSS_HANDLES)

  if (!stores?.length || stores?.length < minimumItems) {
    return null
  }

  return (
    <Fragment>
      <div className={`${handles.seeAllModalButton} mt3`}>
        <Button onClick={() => setModalOpen(true)} variation="secondary">
          <div className={`${handles.seeAllModalButtonText} t-body`}>
            <FormattedMessage id="store/location-availability.pickup-availability.see-all" />
          </div>
        </Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div
          className={`w-100 h-100 items-center justify-center overflow-y-auto bg-base ${handles.modalContainer}`}
          style={
            !isMobile
              ? {
                  maxHeight: '80vh',
                  maxWidth: '90vw',
                  height: 'auto',
                  width: 'auto',
                }
              : {}
          }
        >
          <div
            className={`flex justify-between items-center pv5 sticky top-0 bg-base z-999 ${handles.modalHeader}`}
          >
            <div className="t-heading-3 c-muted-2">
              <FormattedMessage id="store/location-availability.pickup-availability.see-all-stores-heading" />
            </div>
          </div>
          <div className={handles.modalStoreList}>
            <StoreList stores={stores} />
          </div>
        </div>
      </Modal>
    </Fragment>
  )
}

export default SeeAllStoresModal
