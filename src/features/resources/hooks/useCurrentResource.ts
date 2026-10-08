import { useOutletContext } from 'react-router-dom'
import type { Resource } from '../model/types'

/** The resource loaded by ResourceLayout; only valid inside its child routes. */
export const useCurrentResource = () => useOutletContext<Resource>()
