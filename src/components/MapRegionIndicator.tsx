import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Card, Menu, MenuItem, ListItem, ListItemText, List } from '@material-ui/core';

interface MapRegionProps {
    region: string;
}

const options = [
    'UK',
    'Greece',
    'Spain'
  ];

export const MapRegionIndicator: React.FC<MapRegionProps> = ({ region }) => {
    return (
        <Card raised className="map-region">
            <p className="">{"You're currently viewing store locations for " + region}</p>
            <a href="">Not the right location?</a>
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