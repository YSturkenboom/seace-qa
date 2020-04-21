import React from 'react'
import { Card } from '@material-ui/core';

interface MapRegionProps {
    region: string;
}

export const MapRegionIndicator: React.FC<MapRegionProps> = ({ region }) => {
    return (
        <Card raised className="map-region">
            <p className="">{"You're currently viewing store locations for " + region}</p>
        </Card>
    );
}