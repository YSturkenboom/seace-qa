import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Card, Menu, MenuItem, ListItem, ListItemText, List, Button } from '@material-ui/core';

interface MapRegionProps {
    region: string;
    setRegion: React.Dispatch<React.SetStateAction<string>>;
}

const options = [
    'UK',
    'Greece',
    'Spain'
  ];

export const MapRegionIndicator: React.FC<MapRegionProps> = ({ region, setRegion }) => {
    return (
        <Card raised className="map-region">
            <p className="">{"You're currently viewing store locations for " + region}</p>
            <a href="">Not the right location?</a>
            <Button onClick={() => setRegion("Greece")}>Test Greece</Button><Button onClick={() => setRegion("Spain")}>Test Spain</Button><Button onClick={() => setRegion("UK")}>Test UK</Button>
            {/* <Menu
                
                id="lock-menu"
                keepMounted
                open={true}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        disabled={index === 0}
                        selected={index === 0}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu> */}
        </Card>
    );
}