import React, { useState, useEffect } from 'react';
import './MapScreen.css';
import { Filter } from './components/MapFilter'
import { MapLegend } from './components/MapLegend'
import { MapRegionIndicator } from './components/MapRegionIndicator';
import { CompanyLayout } from './interfaces';
// import GoogleMapReact from 'google-map-react';

const { GoogleSpreadsheet } = require('google-spreadsheet');
 
const doc = new GoogleSpreadsheet('1QtCGUCN-_xZPLYExN3btHeXphRi4VI-uGABA87cHj-M');

const REGION_TO_SHEET_MAP = {
  'uk': 9
}

function MapScreen() {
  const [region, setRegion] = useState<string>('uk');
  const [companies, setCompanies] = useState<Array<CompanyLayout> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<{lat: number, lon: number} | null>({lat: 50.8742724, lon: 0.6619475})

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

  return (
    <div className="map-screen">
      {/* <iframe
        width="100%"
        height="100%"
        style={{border:0}}
        src="https://www.google.com/maps/embed/v1/place?key=API_KEY
          &q=Space+Needle,Seattle+WA">
      </iframe> */}
      {/* <GoogleMapReact
        bootstrapURLKeys={{ key: 'gme-samsungsds' }}
        defaultCenter={{lat: 59.95, lng: 30.33}}
        defaultZoom={11}
      > */}
        <Filter onSubmit={() => {}} loading={loading} companies={companies} searchLocation={searchLocation}/>
        <MapLegend isOpened={true}/>
        <MapRegionIndicator region={region}/>
      {/* </GoogleMapReact> */}
    </div>
  );
}

export default MapScreen;