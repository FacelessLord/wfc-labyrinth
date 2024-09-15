import React from "react";

interface Props {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    gap?: string | number;
}

export const Row = (props: Props) => {
    return (<div style={{display: "flex", flexDirection: "row", gap: props.gap + "px", ...props.style}}
                 className={props.className}>{props.children}</div>);
};
export const Column = (props: Props) => {
    return (<div style={{display: "flex", flexDirection: "column", gap: props.gap + "px", ...props.style}}
                 className={props.className}>{props.children}</div>);
};

export const Grid = (props: Props) => {
    return <div
        style={{display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gridTemplateRows: "1fr 2fr 1fr", ...props.style}}
        className={props.className}>
        {props.children}
    </div>
}