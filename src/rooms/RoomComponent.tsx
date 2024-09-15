import {RoomInternals, RoomPrototype, SideType} from "./room";
import React from "react";
import {Column, Grid, Row} from "../layout/Layout";

interface Props {
    prototype: RoomPrototype,
}

const ROOM_SIZE = 12;
const INTERNAL_SIZE = 8;

const BORDER_SIZE = (ROOM_SIZE - INTERNAL_SIZE) / 2;

function createBorderStyle(sides: [SideType, SideType, SideType, SideType], grow: boolean = false): React.CSSProperties {
    const getBorderColor = (side: SideType) => {
        switch (side) {
            case SideType.Wall:
                return '#848484';
            case SideType.None:
                return '#ffffff';
        }
    };

    const getBorder = (side: SideType) => {
        const color = getBorderColor(side);
        switch (side) {
            case SideType.Wall:
                return `solid ${BORDER_SIZE / 2}px ${color}`;
            case SideType.None:
                return `solid ${BORDER_SIZE / 2}px ${color}`;
        }
    };
    const colors = sides.map(getBorder) as [string, string, string, string];

    return {
        borderTop: colors[0],
        borderRight: colors[1],
        borderBottom: colors[2],
        borderLeft: colors[3],
        backgroundColor: getBorderColor(sides[0]),
    };
}

function createInternalBorderStyles(internals: RoomInternals): React.CSSProperties {
    const getInternalColor = (side: RoomInternals) => {
        switch (side) {
            case RoomInternals.None:
                return '#ffffff';
            case RoomInternals.Chest:
                return '#ebd900';
            case RoomInternals.Bridge:
                return '#ab7100';
            case RoomInternals.Spawn:
                return '#e252ff';
        }
    }
    return {width: INTERNAL_SIZE, height: INTERNAL_SIZE, backgroundColor: getInternalColor(internals)};
}

export const RoomComponent = (props: Props) => {
    if (!props.prototype) {
        return (<div style={{width: ROOM_SIZE, height: ROOM_SIZE, backgroundColor: "#ffa252"}}/>);
    }

    const interfaces = props.prototype.sidesInterfaces;

    const leftTop = interfaces[3][2];
    const topLeft = interfaces[0][0];

    const topCenter = interfaces[0][1];

    const topRight = interfaces[0][2];
    const rightTop = interfaces[1][0];

    const rightCenter = interfaces[1][1];

    const rightBottom = interfaces[1][2];
    const bottomRight = interfaces[2][0];

    const bottomCenter = interfaces[2][1];

    const bottomLeft = interfaces[2][2];
    const leftBottom = interfaces[3][0];

    const leftCenter = interfaces[3][1];

    return (<Grid style={{width: ROOM_SIZE, height: ROOM_SIZE}} className="Room">
        <div style={createBorderStyle([topLeft, topLeft, leftTop, leftTop])}/>
        <div style={createBorderStyle([topCenter, topCenter, topCenter, topCenter], true)}/>
        <div style={createBorderStyle([topRight, rightTop, rightTop, topRight])}/>
        <div style={createBorderStyle([leftCenter, leftCenter, leftCenter, leftCenter], true)}/>
        <div style={createInternalBorderStyles(props.prototype.internals)}/>
        <div style={createBorderStyle([rightCenter, rightCenter, rightCenter, rightCenter], true)}/>
        <div style={createBorderStyle([leftBottom, bottomLeft, bottomLeft, leftBottom])}/>
        <div style={createBorderStyle([bottomCenter, bottomCenter, bottomCenter, bottomCenter], true)}/>
        <div style={createBorderStyle([rightBottom, rightBottom, bottomRight, bottomRight])}/>
    </Grid>);
};