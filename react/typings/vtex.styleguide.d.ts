declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const PageBlock: ComponentType<Props>
  export const Modal: ComponentType<Props>
  export const Button: ComponentType<Props>
  export const ButtonPlain: ComponentType<Props>
  export const ButtonWithIcon: ComponentType<Props>
  export const Input: ComponentType<Props>
  export const Spinner: ComponentType<Props>
  export const Dropdown: ComponentType<Props>
  export const Checkbox: ComponentType<Props>
  export const Toggle: ComponentType<Props>
  export const Divider: ComponentType<Props>
  export const IconCheck: ComponentType<Props>
  export const IconClose: ComponentType<Props>
  export const IconDelete: ComponentType<Props>
  export const IconLocation: ComponentType<Props>

  interface Props {
    [key: string]: any
  }
}
