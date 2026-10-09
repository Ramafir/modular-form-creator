import { createGlobalStyle } from 'styled-components'

/**
 * Additions to the design-system global styles: form controls do not inherit the
 * page font by default (textareas even fall back to a monospace font).
 */
export const AppGlobalStyles = createGlobalStyle`
  input,
  select,
  textarea {
    font-family: inherit;
  }
`
