import React from 'react'
import { PinDropOutlined } from '@material-ui/icons';

interface LocationCardProps {
    name: string;
    address: string;
    telephone: string | number;
    distance: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({ name, address, telephone, distance }) => {
        return (
            <div className="map-search-location">
                <div className="map-search-location-info">
                    <p className="map-search-location-info-title">{name}, {(Math.round((distance + Number.EPSILON) * 100) / 100).toString()} miles</p>
                    <p>{address}</p>
                    <p>Phone: <a href="tel:{telephone}">{telephone}</a></p>
                </div>
                <div className="map-search-location-icons">
                    <PinDropOutlined />
                </div>
            </div>
        );
}