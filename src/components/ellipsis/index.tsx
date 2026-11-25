import React, {useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';
import Tooltip from '../tooltip';

export interface Props {
    children: string,
    style?: React.CSSProperties;
    tooltip?: boolean,
    tooltipStyle?: React.CSSProperties,
}

function Ellipsis({ children, style, tooltip = false, tooltipStyle }: Props) {
    const [start, setStart] = useState(-1);
    const [end, setEnd] = useState(-1);
    const [text, setText] = useState(children);
    const [show, setShow] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const contentRef = useRef<HTMLSpanElement>(null);
    const ref = useRef<HTMLSpanElement>(null);
    // use binary search to trim the overflown text
    useLayoutEffect(() => {
        const elem = contentRef.current!;
        const parent = elem.parentElement!;
        const { paddingBottom } = window.getComputedStyle(parent);
        const height = parent.getBoundingClientRect().height - parseInt(paddingBottom);
        const ch = elem.getBoundingClientRect().height;
        let emptySpaceLen = 0;
        /* eslint-disable react-hooks/set-state-in-effect */
        if (ch > height) {
            if (start === -1 && end === -1) {
                setStart(0);
                setEnd(children.length - 1);
                setText(children.slice(0, children.length >> 1));
            } else {
                const m = (start + end) >> 1;
                if (m === end) {
                    emptySpaceLen = 4;
                    setShow(true);
                }
                setEnd(m);
                setText(children.slice(0, ((start + m) >> 1) - emptySpaceLen));
            }
        } else if (start !== -1 && end !== -1) {
            const m = (start + end) >> 1;
            if (m === start) {
                emptySpaceLen = 4;
                setShow(true);
            }
            setStart(m);
            setText(children.slice(0, ((m + end) >> 1) - emptySpaceLen));
        }
        /* eslint-enable react-hooks/set-state-in-effect */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]);


    let offsetTop = 0;
    /* eslint-disable react-hooks/refs */
    if (contentRef.current) {
        const { lineHeight, fontSize } = window.getComputedStyle(contentRef.current!)
        offsetTop = (lineHeight === "normal" ? 1.5 : (+lineHeight + 0.3)) * parseInt(fontSize);
    }

    let offsetLeft = 0;
    if (ref.current)
        offsetLeft = ref.current!.getBoundingClientRect().width;
    return (
        <span style={{...style, overflow: 'hidden', wordBreak: 'break-word'}} ref={contentRef}>
            {text}
            {show && <span ref={ref} onPointerOver={() => tooltip && setShowTooltip(true)} onPointerLeave={() => tooltip && setShowTooltip(false)}>...</span>}
            {showTooltip && createPortal(<Tooltip content={children} bounds={ref.current!.getBoundingClientRect()} offsetTop={offsetTop} offsetLeft={offsetLeft} style={tooltipStyle}/>, document.body)}
        </span>
    );
    /* eslint-enable react-hooks/refs */
}

export default Ellipsis