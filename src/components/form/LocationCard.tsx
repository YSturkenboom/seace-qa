import React from 'react'
import { GoogleMap } from "react-google-maps"
import {ReactComponent as Home} from '../../home.svg';
import {ReactComponent as Biz} from '../../biz.svg';
import {ReactComponent as Both} from '../../both.svg';

interface LocationCardProps {
    name: string;
    address: string;
    telephone: string | number;
    distance: number;
    mapRef: React.RefObject<GoogleMap>;
    lat: number;
    lon: number;
    setActivePlace: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    installerType: string;
    distanceType: string;
    translation: any;
}

const goToLocation = ({mapRef, lat, lon} : {mapRef: React.RefObject<GoogleMap>, lat: number, lon: number}) => {
    if ( mapRef && mapRef.current) {
        mapRef.current.panTo({ lat: parseFloat(String(lat)), lng: parseFloat(String(lon))});
    }
}

export const LocationCard: React.FC<LocationCardProps> = ({ lat, lon, name, address, telephone, distance, mapRef, setActivePlace, installerType, distanceType, translation }) => {
    let icon;
    if (installerType === 'For home') {
        icon = <Home />;
    } else if (installerType === 'For business') {
        icon = <Biz />;
    } else {
        icon = <Both />;
    }
    let distanceString;

    if (distanceType === 'mile') {
        distanceString = (Math.round(((distance / 1.609344) * 100)) / 100).toString() + ' miles';
    } else {
        distanceString = (Math.round(distance * 100) / 100).toString() + ' km';
    }

    return (
        <button className="map-search-location" onClick={() => { 
            goToLocation({mapRef, lat, lon});
            setActivePlace(name);
        }}>
            <div className="map-search-location-info">
                <p className="map-search-location-info-title">{name}{distance !== 0 && ', ' + distanceString}</p>
                <p>{address}</p>
                <p>Phone: <a href="tel:{telephone}">{telephone}</a></p>
            </div>
            <div className="map-search-location-icons">
                {icon}
            </div>
        </button>
    );
}