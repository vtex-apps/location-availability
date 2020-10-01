import React, { FunctionComponent, useContext, useReducer } from 'react'

type ReducerActions =
  | {
      type: 'SET_LOCATION'
      args: { location: SimpleLocation }
    }
  | {
      type: 'SET_SLAS'
      args: { pickupSlas: SLA[]; shippingSlas: SLA[] }
    }

type Dispatch = (action: ReducerActions) => void

const initialLocation = {
  postalCode: '',
  country: '',
  lat: '',
  long: '',
}

const initialSimpleLocationState = {
  location: initialLocation,
  pickupSlas: [],
  shippingSlas: [],
}

const SimpleLocationStateContext = React.createContext<
  SimpleLocationContextProps
>(initialSimpleLocationState)

const SimpleLocationDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(
  state: SimpleLocationContextProps,
  action: ReducerActions
): SimpleLocationContextProps {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.args.location,
      }

    case 'SET_SLAS':
      return {
        ...state,
        pickupSlas: action.args.pickupSlas,
        shippingSlas: action.args.shippingSlas,
      }

    default:
      return state
  }
}

const SimpleLocationContextProvider: FunctionComponent<SimpleLocationContextProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialSimpleLocationState)

  return (
    <SimpleLocationStateContext.Provider value={state}>
      <SimpleLocationDispatchContext.Provider value={dispatch}>
        {children}
      </SimpleLocationDispatchContext.Provider>
    </SimpleLocationStateContext.Provider>
  )
}

function useSimpleLocationState() {
  const context = useContext(SimpleLocationStateContext)

  if (context === undefined) {
    throw new Error(
      'useSimpleLocationState must be used within a SimpleLocationStateContextProvider'
    )
  }

  return context
}

function useSimpleLocationDispatch() {
  const context = useContext(SimpleLocationDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useSimpleLocationDispatch must be used within a SimpleLocationDispatchContextProvider'
    )
  }

  return context
}

export {
  SimpleLocationContextProvider,
  initialSimpleLocationState,
  useSimpleLocationDispatch,
  useSimpleLocationState,
}
