import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Card, Menu, MenuItem, ListItem, ListItemText, List, Button, Select, InputLabel, FormControl } from '@material-ui/core';

interface MapRegionProps {
    region: string;
    setRegion: React.Dispatch<React.SetStateAction<string>>;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    searchLocation: any;
    translation: any;
}

const options = [
    'UK',
    'Greece',
    'Spain'
  ];

export const MapRegionIndicator: React.FC<MapRegionProps> = ({ region, setRegion, setLanguage, searchLocation, translation }) => {
    return (
        <Card raised className="map-region">
            <p className="">{"You're currently viewing store locations for " + region}</p>
            <a href="">Not the right location?</a><br></br>
            <FormControl style={{width:'150px'}}>
                <InputLabel id="demo-simple-select-label">Debug region</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                >
                    <Button onClick={() => setRegion("Spain")}>Test Spain</Button><br></br>
                    <Button onClick={() => setRegion("Sweden")}>Test Sweden</Button><br></br>
                    <Button onClick={() => setRegion("Denmark")}>Test Denmark</Button><br></br>
                    <Button onClick={() => setRegion("Finland")}>Test Finland</Button><br></br>
                    <Button onClick={() => setRegion("Italy")}>Test Italy</Button><br></br>
                    <Button onClick={() => setRegion("Norway")}>Test Norway</Button><br></br>
                    <Button onClick={() => setRegion("SEROM")}>Test SEROM</Button><br></br>
                    <Button onClick={() => setRegion("France")}>Test France</Button><br></br>
                    <Button onClick={() => setRegion("UK")}>Test UK</Button><br></br>
                    <Button onClick={() => setRegion("Greece")}>Test Greece</Button><br></br>
                    <Button onClick={() => setRegion("Poland")}>Test Poland</Button><br></br>
                    <Button onClick={() => setRegion("Czech & Slovakia")}>Test Czech & Slovakia</Button><br></br>
                    <Button onClick={() => setRegion("Portugal")}>Test Portugal</Button><br></br>
                    <Button onClick={() => setRegion("Hungary")}>Test Hungary</Button><br></br>
                    <Button onClick={() => setRegion("SEAD")}>Test SEAD</Button><br></br>
                    <Button onClick={() => setRegion("SEB")}>Test SEB</Button><br></br>
                </Select>
            </FormControl>
            <FormControl style={{width:'150px'}}>
                <InputLabel id="demo-simple-select-label">Debug language</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                >
                    <Button onClick={() => setLanguage("Spanish")}>Test Spanish</Button><br></br>
                    <Button onClick={() => setLanguage("Swedish")}>Test Swedish</Button><br></br>
                    <Button onClick={() => setLanguage("Danish")}>Test Danish</Button><br></br>
                    <Button onClick={() => setLanguage("Finnish")}>Test Finnish</Button><br></br>
                    <Button onClick={() => setLanguage("Italian")}>Test Italian</Button><br></br>
                    <Button onClick={() => setLanguage("Norwegian")}>Test Norwegian</Button><br></br>
                    <Button onClick={() => setLanguage("French")}>Test French</Button><br></br>
                    <Button onClick={() => setLanguage("English")}>Test English</Button><br></br>
                </Select>
            </FormControl>

            <pre>
                {JSON.stringify({
                    searchLocation,
                    translation: translation && translation['Language'],
                    region
                })}
                {/* {searchLocation && searchLocation.lat}<br></br>
                {searchLocation && searchLocation.lon}<br></br>
                {translation && translation['Language']}<br></br>
                {region && region} */}
            </pre>
            
            
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