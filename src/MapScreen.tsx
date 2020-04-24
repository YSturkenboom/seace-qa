/// @ts-nocheck
import React, { useState, useEffect, Fragment } from 'react';
import './MapScreen.css';
import { Filter } from './components/MapFilter'
import { MapLegend } from './components/MapLegend'
import { MapRegionIndicator } from './components/MapRegionIndicator';
import { CompanyLayout, LocationLayout } from './interfaces';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import {ReactComponent as Home} from './home.svg';
import {ReactComponent as Biz} from './biz.svg';
import {ReactComponent as Both} from './both.svg';
import { renderToStaticMarkup } from 'react-dom/server';

const { GoogleSpreadsheet } = require('google-spreadsheet');
 
const doc = new GoogleSpreadsheet('1QtCGUCN-_xZPLYExN3btHeXphRi4VI-uGABA87cHj-M');

const REGION_TO_SHEET_MAP = {
  'UK': 9,
  'Greece': 10,
  'Spain': 1
}

function MapScreen() {
  const [region, setRegion] = useState<string>('UK');
  const [companies, setCompanies] = useState<Array<CompanyLayout> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<LocationLayout | null>({lat: 50.8742724, lon: 0.6619475})
  const [activePlace, setActivePlace] = useState<string | null>();

  const mapRef = React.createRef<React.RefObject<GoogleMap>>();
  const fetchGoogleSheet = async () => {
    await doc.useServiceAccountAuth(require('./SEACE Installer Locator-5a80e6b026be.json'));
  }

  // const onSearch = async (query: string) => {
  //   const point = {lat: 51.5287714, lon: -0.2420237}
  //   // const point = GMaps.getLocation(query)
  // }

  const fetchCompaniesForRegion = async (region: string) => {
    try {
      setLoading(true);
      await doc.loadInfo();
      console.log(doc.title);
      const sheet = doc.sheetsByIndex[REGION_TO_SHEET_MAP[region]]
      const rows = await sheet.getRows();
      setCompanies(rows);
      console.log(rows);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  // Only once
  useEffect(() => {fetchGoogleSheet()});

  // Every region change
  useEffect(() => {
    fetchCompaniesForRegion(region);
  }, [region]);

  const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: 51.8266266, lng: -2.2714084 }}
      ref={mapRef}
    >
      {companies && companies.map(c => {
        const productType = String(c['Product Type']).toLowerCase();
        const position = { lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) };
        const installerType = String(c['Installer Type'])
       
        // Select icon based on the installer type
        let icon;
        if (installerType === 'For home') {
            icon = <Home />;
        } else if (installerType === 'For business') {
            icon = <Biz />;
        } else {
            icon = <Both />;
        }

        return <Marker 
          position={position} 
          onClick={() =>{
            mapRef.current.panTo({ lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) });
            setActivePlace(c['Company name']);
          }}
          // icon={{url: `data:image/svg+xml,${encodeURIComponent(renderToStaticMarkup(icon))}`}}
        >
          {/* If this place is active, show the popup with the place information */}
          {activePlace && activePlace === c['Company name'] &&
            <InfoWindow>
              <Fragment>
                <p>{c['Company name']}</p>
                <p>{c['Street Address']}</p>
                <p>{c['City']}</p>
                <p>{c['Installer Type']}</p>
                <p>{c['Website']}</p>
                <p>Contact Name: {c['Contact Name']}</p>
                <p>{c['Email']}</p>
                <p>{c['Phone number']}</p>
              </Fragment>
            </InfoWindow>
          }
          
        </Marker>
      })}
      {/* <Marker position={{ lat: 51.8266266, lng: 150.644 }} /> */}
    </GoogleMap>
  ))

  return (
    /*<div className="map-screen">*/
      /* <iframe
        width="100%"
        height="100%"
        style={{border:0}}
        src="https://www.google.com/maps/embed/v1/place?key=API_KEY
          &q=Space+Needle,Seattle+WA">
      </iframe> */
      /* <GoogleMapReact
        bootstrapURLKeys={{ key: 'gme-samsungsds' }}
        defaultCenter={{lat: 59.95, lng: 30.33}}
        defaultZoom={11}
      > */
      <div>
        <MyMapComponent
          className="map-screen"
          isMarkerShown={true}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        >
        </MyMapComponent>
        <Filter onSubmit={() => {}} loading={loading} companies={companies} searchLocation={searchLocation} mapRef={mapRef} setActivePlace={setActivePlace}/>
        <MapLegend isOpened={true}/>
        <MapRegionIndicator region={region}/>
      </div>
  );
}

export default MapScreen;