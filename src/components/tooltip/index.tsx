import React from 'react'
export interface Props {
    content: string,
    style?: React.CSSProperties,
    bounds: {
      x: number,
      y: number
    },
    offsetTop?: number,
    offsetLeft?: number,
    width?: number,
}
function Tooltip({content, style, bounds: {x, y}, width = Math.min(240, window.innerWidth), offsetTop = 15, offsetLeft = 15 }: Props) {
  let top = y + offsetTop;
  let left = x + offsetLeft;
  let right = 0
  if (left + width > window.innerWidth) {
    left = 0;
    right = left;
  }
  return (
    <div style={{backgroundColor: 'rgba(0,0,0, .7)', color: '#FFF', minWidth: width, ...style, position:'absolute', top, left, right }}>{content}</div>
  )
}

export default Tooltip