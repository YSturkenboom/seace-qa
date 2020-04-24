import React from 'react'
import { Card } from '@material-ui/core';
import { PinDropOutlined } from '@material-ui/icons';
import {ReactComponent as Home} from '../home.svg';
import {ReactComponent as Biz} from '../biz.svg';
import {ReactComponent as Both} from '../both.svg';


interface MapLegendProps {
    isOpened: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({ isOpened }) => {
    return (
        <Card raised className="map-legend">
            <p className="map-legend-title">Key</p>
            <div className="map-legend-icons">
                <div className="map-legend-icons-block">
                    <Home />
                    <p>For Home</p>
                </div>
                <div className="map-legend-icons-block">
                    <Biz />
                    <p>For Business</p>
                </div>
                <div className="map-legend-icons-block">
                    <Both />
                    <p>For Home and Business</p>
                </div>
            </div>
        </Card>
    );
}