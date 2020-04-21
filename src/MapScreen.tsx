/// @ts-nocheck
import React, { useState, useEffect } from 'react';
import './MapScreen.css';
import { Filter } from './components/MapFilter'
import { MapLegend } from './components/MapLegend'
import { MapRegionIndicator } from './components/MapRegionIndicator';
import { CompanyLayout, LocationLayout } from './interfaces';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const { GoogleSpreadsheet } = require('google-spreadsheet');
 
const doc = new GoogleSpreadsheet('1QtCGUCN-_xZPLYExN3btHeXphRi4VI-uGABA87cHj-M');

const REGION_TO_SHEET_MAP = {
  'uk': 9
}

function MapScreen() {
  const [region, setRegion] = useState<string>('uk');
  const [companies, setCompanies] = useState<Array<CompanyLayout> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [centeredOn, setCenteredOn] = useState<LocationLayout | null>({lat: 50.8742724, lon: 0.6619475})
  const [searchLocation, setSearchLocation] = useState<LocationLayout | null>({lat: 50.8742724, lon: 0.6619475})

  const mapRef = React.createRef();
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
      const sheet = doc.sheetsByIndex[REGION_TO_SHEET_MAP['uk']]
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
      {/* <Marker position={{ lat: 51.8266266, lng: -2.2714084 }} /> */}
      {companies && companies.map(c => {
        const productType = String(c['Product Type']).toLowerCase();
        // const icon = productType === 'cooling' ? require('./cool.png') : require('./heat.png')
        return <Marker 
          position={{ lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) }} 
          onClick={() =>{ mapRef.current.panTo({ lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) });}}// icon={{url: icon}}
        />
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
        <Filter onSubmit={() => {}} loading={loading} companies={companies} searchLocation={searchLocation}/>
        <MapLegend isOpened={true}/>
        <MapRegionIndicator region={region}/>
      </div>
  );
}

export default MapScreen;