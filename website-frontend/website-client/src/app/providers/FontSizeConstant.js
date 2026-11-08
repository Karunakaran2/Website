export const FONT_SIZES = {
  'user-xs': { className: 'user-xs', label: 'Extra Small', dataSize: 'xs' },
  'user-sm': { className: 'user-sm', label: 'Small', dataSize: 'sm' },
  'user-base': { className: 'user-base', label: 'Base', dataSize: 'md' },
  'user-lg': { className: 'user-lg', label: 'Large', dataSize: 'lg' },
  'user-xl': { className: 'user-xl', label: 'Extra Large', dataSize: 'xl' },
}

export const SIZE_KEYS = Object.keys(FONT_SIZES)
export const BASE_INDEX = SIZE_KEYS.indexOf('user-base')

export const FONT_CLASS_TO_DATA_SIZE = Object.fromEntries(
  SIZE_KEYS.map((key) => [key, FONT_SIZES[key].dataSize]),
)
