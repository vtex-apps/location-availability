import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useSimpleLocationState } from './context/SimpleLocationContext'

const CSS_HANDLES = ['availabilityHeader', 'availabilityHeaderLink'] as const

interface Props {
  styleAsLink: boolean
}

const AvailabilityHeader: StorefrontFunctionComponent<Props> = ({
  styleAsLink = false,
}) => {
  const { location } = useSimpleLocationState()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.availabilityHeader} t-heading-4 ${
        styleAsLink && `pointer`
      }`}
    >
      {!location.postalCode && !location.lat && !location.long ? (
        <FormattedMessage id="store/location-availability.availability-header.no-location" />
      ) : (
        <FormattedMessage
          id="store/location-availability.availability-header"
          values={{
            postalCode: (
              <span
                className={
                  styleAsLink
                    ? `${handles.availabilityHeaderLink} c-action-primary underline`
                    : ''
                }
              >
                {location.postalCode}
              </span>
            ),
          }}
        />
      )}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.location-availability.availability-header.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.location-availability.availability-header.description',
  },
  styleAsLink: {
    defaultMessage: '',
    id: 'admin/editor.location-availability.availability-header.styleAsLink',
  },
})

AvailabilityHeader.schema = {
  title: messages.title,
  description: messages.description,
  type: 'object',
  properties: {
    styleAsLink: {
      title: messages.styleAsLink,
      type: 'boolean',
      default: false,
      isLayout: true,
    },
  },
}

AvailabilityHeader.defaultProps = {
  styleAsLink: false,
}

export default AvailabilityHeader
