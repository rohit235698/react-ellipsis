import React, { useLayoutEffect, useRef, useState } from 'react'
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
interface Position {
  top?: number,
  left?: number,
  bottom?: number,
  right?: number
};
function Tooltip({content, style, bounds: {x, y}, width = Math.min(240, window.innerWidth), offsetTop = 15, offsetLeft = 15 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position>({ top : y + offsetTop, left: x + offsetLeft });
  useLayoutEffect(() => {
    if (ref.current) {
        let { top, left, bottom, right } = pos;
        const { height } = ref.current.getBoundingClientRect();
        if (left !== undefined && left + width > window.innerWidth) {
            left = undefined;
            right = window.innerWidth - x;
        }
        if (top !== undefined && top + height > window.innerHeight) {
            top = undefined;
            bottom = window.innerHeight - y;
        }
        setPos({ top, left, bottom, right });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} style={{backgroundColor: '#000', color: '#fff', minWidth: width, ...style, position:'absolute', ...pos }}>{content}</div>
  )
}

export default Tooltip