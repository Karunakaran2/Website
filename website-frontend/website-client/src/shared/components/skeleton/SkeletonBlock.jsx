import React from 'react'
import PropTypes from 'prop-types'
import { SKELETON_PULSE_CLASS, SKELETON_SURFACE_CLASS } from './skeletonStyles'

/** Base Org UI pulse block for skeleton loaders */
export default function SkeletonBlock({ className = '', animate = true, ...props }) {
  const motionClass = animate ? SKELETON_PULSE_CLASS : 'motion-reduce:animate-none'
  return (
    <div
      className={`${SKELETON_SURFACE_CLASS} ${motionClass} ${className}`.trim()}
      aria-hidden="true"
      {...props}
    />
  )
}

SkeletonBlock.propTypes = {
  className: PropTypes.string,
  animate: PropTypes.bool,
}
