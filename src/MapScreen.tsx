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
  'Spain': 1,
  'Sweden': 2,
  'Denmark': 3,
  'Finland': 4,
  'Italy': 5,
  'Norway': 6,
  'SEROM': 7,
  'France': 8,
  'UK': 9,
  'Greece': 10,
  'Poland': 11,
  'Czech & Slovakia': 12,
  'Portugal': 13,
  'Hungary': 14,
  'SEAD': 15,
  'SEB': 16
}

const REGION_TO_COORDS_MAP = {
  'Spain': {lat: 40.1213227, lon: -8.2126345},
  'Sweden': {lat: 61.7408759, lon: 8.4226912},
  'Denmark': {lat: 56.2097048, lon: 9.2950757},
  'Finland': {lat: 64.6222352, lon: 17.0720047},
  'Italy': {lat: 41.2031887, lon: 8.2129043},
  'Norway': {lat: 64.2853881, lon: 8.7594611},
  'SEROM': {lat: 44.3937893, lon: 23.84318377},
  'France': {lat: 46.1309898, lon: -2.4457894},
  'UK': {lat: 54.217289, lon: -13.4466842},
  'Greece': {lat: 38.1244038, lon: 22.2327838},
  'Poland': {lat: 51.8680396, lon:14.63899},
  'Czech & Slovakia': {lat: 49.2061586, lon: 15.9140313},
  'Portugal': {lat: 39.5601752, lon: -8.8019426},
  'Hungary': {lat: 47.155667, lon: 18.3812087},
  'SEAD': {lat: 43.7446054, lon: 16.788233},
  'SEB': {lat: 56.7993995, lon: 22.503913}
}

function MapScreen() {
  const [region, setRegion] = useState<string>('UK');
  const [companies, setCompanies] = useState<Array<CompanyLayout> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<LocationLayout | null>({lat: 50.8742724, lon: 0.6619475})
  const [activePlace, setActivePlace] = useState<string | null>();
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [storeType, setStoreType] = useState<string>('For home & business')
  const [productType, setProductType] = useState<string>('Cooling & Heating');
  const [distanceType, setDistanceType] = useState<string>('km');
  const [distance, setDistance] = useState<number>(10);
  const [searchType, setSearchType] = useState<'simple' | 'advanced'>('simple');

  const mapRef = React.createRef<React.RefObject<GoogleMap>>();
  const fetchGoogleSheet = async () => {
    await doc.useServiceAccountAuth(require('./SEACE Installer Locator-5a80e6b026be.json'));
  }

  // const onSearch = async (query: string) => {
  //   const point = {lat: 51.5287714, lon: -0.2420237}
  //   // const point = GMaps.getLocation(query)
  // }

  const distanceToTarget = (location: LocationLayout, locationTarget: LocationLayout) => {
    // TODO: Replace with maps distance
    var a = location.lat - locationTarget.lat;
    var b = location.lon - locationTarget.lon;    
    return Math.sqrt( a*a + b*b );
  };

  const fetchCompaniesForRegion = async (region: string) => {
    try {
      setLoading(true);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[REGION_TO_SHEET_MAP[region]]
      const rows = await sheet.getRows();
      const centerCoords = REGION_TO_COORDS_MAP[region]
      setCompanies(rows);
      setSearchLocation(centerCoords);
      
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

  // Every filter change, or when companies load in
  useEffect(() => {
    if (companies && searchLocation) {

      const filterCompanies = (companies: Array<CompanyLayout>, distance: number, searchLocation: LocationLayout, storeType: string, productType: string, searchType: string): Array<CompanyLayout> => {
        // Filter on type first for performance
        let filteredCompanies = companies
        if (searchType === 'advanced') {
            if (storeType === 'For home' || storeType === 'For business') {
                filteredCompanies =  filteredCompanies.filter(c => c['Installer Type'] === storeType || c['Installer Type'] === 'For home & business');
            }
            if (productType === 'Cooling' || productType === 'Heating') {
                filteredCompanies =  filteredCompanies.filter(c => c['Product Type'] === productType || c['Product Type'] === 'Cooling & Heating');
            }
        }

        // Calculate distance
        filteredCompanies = filteredCompanies.map(c => {
            console.log({storeType: storeType, type: c['Installer Type']});
            console.log({lat: parseFloat(String(c['Latitude'])), lon: parseFloat(String(c['Longitude']))});
            
            const location = {
                lat: parseFloat(String(c['Latitude'])),
                lon: parseFloat(String(c['Longitude']))
            }
            c.distanceToTarget = distanceToTarget(location, searchLocation);
            return c;
        })

        // Filter on distance

        return filteredCompanies.filter(c => c.distanceToTarget <= distance);
      }

      setFilteredCompanies(filterCompanies(companies, distance, searchLocation, storeType, productType, searchType));
    }
}, [searchLocation, companies, storeType, productType, distance, searchType]);

  const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: 51.8266266, lng: -2.2714084 }}
      ref={mapRef}
    >
      {filteredCompanies && filteredCompanies.map((c, idx) => {
        const productType = String(c['Product Type']).toLowerCase();
        const position = { lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) };
        const installerType = String(c['Installer Type'])
       
        // Select icon based on the installer type
        let icon;
        if (installerType === 'For home') {
          icon = require('./home.svg')
        } else if (installerType === 'For business') {
          icon = require('./biz.svg')
        } else {
          icon = require('./both.svg')
        }

        return <Marker 
          position={position} 
          onClick={() =>{
            mapRef.current.panTo({ lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) });
            setActivePlace(c['Company name']);
          }}
          icon={{url: icon}}
          label={{color: 'white', fontSize: '16px', paddingBottom: '150px', text: (idx+1).toString() }}
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
          // googleMapURL="https://maps.googleapis.com/maps/api/js?client=gme-samsungsds&v=3.exp&libraries=geometry,drawing,places"
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        >
        </MyMapComponent>
        <Filter
          onSubmit={() => {}}
          loading={loading}
          companies={filteredCompanies}
          searchLocation={searchLocation}
          mapRef={mapRef}
          setActivePlace={setActivePlace}
          setDistance={setDistance}
          setStoreType={setStoreType}
          distanceType={distanceType}
          setDistanceType={setDistanceType}
          setProductType={setProductType}
          searchType={searchType}
          setSearchType={setSearchType}
        />
        <MapLegend isOpened={true}/>
        <MapRegionIndicator region={region} setRegion={setRegion}/>
      </div>
  );
}

export default MapScreen;