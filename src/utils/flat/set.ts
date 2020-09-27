import { flatten } from 'flat'
import { DELIMITER } from './constants'
import { FlattenParams } from '../flat'
import { propertyKeyRegex } from './property-key-regex'

/**
 *
 * @memberof module:flat
 * @param {FlattenParams} params
 * @param {string} property
 * @param {any} [value]       if not give function will only try to remove old keys
 */
const set = (params: FlattenParams = {}, property: string, value?: any): FlattenParams => {
  const regex = propertyKeyRegex(property)

  // remove all existing keys
  const paramsCopy = Object.keys(params)
    .filter(key => !key.match(regex))
    .reduce((memo, key) => ({ ...memo, [key]: params[key] }), {} as FlattenParams)

  if (typeof value !== 'undefined') {
    if (typeof value === 'object' && !(value instanceof File) && value !== null) {
      const flattened = flatten(value) as any

      if (Object.keys(flattened).length) {
        Object.keys(flattened).forEach((key) => {
          paramsCopy[`${property}${DELIMITER}${key}`] = flattened[key]
        })
      } else if (Array.isArray(value)) {
        paramsCopy[property] = []
      } else {
        paramsCopy[property] = {}
      }
    } else {
      paramsCopy[property] = value
    }
  }
  return paramsCopy
}

export { set }
