/// @ts-nocheck
import React, { useState, useEffect, Fragment } from 'react';
import './MapScreen.css';
import { Filter } from './components/MapFilter'
import { MapLegend } from './components/MapLegend'
import { MapRegionIndicator } from './components/MapRegionIndicator';
import { CompanyLayout, LocationLayout } from './interfaces';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, Circle } from "react-google-maps"

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

const LANGUAGE_TO_ROW_MAP = {
  'Spanish': 22,
  'Danish': 14,
  'Finnish': 15,
  'Italian': 13,
  'Norwegian': 16,
  'French': 10,
  'English': 0
}

const REGION_TO_COORDS_MAP = {
  'Spain': { lat: 40.1213227, lon: -8.2126345 },
  'Sweden': { lat: 61.7408759, lon: 8.4226912 },
  'Denmark': { lat: 56.2097048, lon: 9.2950757 },
  'Finland': { lat: 64.6222352, lon: 17.0720047 },
  'Italy': { lat: 41.2031887, lon: 8.2129043 },
  'Norway': { lat: 64.2853881, lon: 8.7594611 },
  'SEROM': { lat: 44.3937893, lon: 23.84318377 },
  'France': { lat: 46.1309898, lon: -2.4457894 },
  'UK': { lat: 54.217289, lon: -13.4466842 },
  'Greece': { lat: 38.1244038, lon: 22.2327838 },
  'Poland': { lat: 51.8680396, lon: 14.63899 },
  'Czech & Slovakia': { lat: 49.2061586, lon: 15.9140313 },
  'Portugal': { lat: 39.5601752, lon: -8.8019426 },
  'Hungary': { lat: 47.155667, lon: 18.3812087 },
  'SEAD': { lat: 43.7446054, lon: 16.788233 },
  'SEB': { lat: 56.7993995, lon: 22.503913 }
}

function MapScreen() {
  const [region, setRegion] = useState<string>('UK');
  const [companies, setCompanies] = useState<Array<CompanyLayout> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<LocationLayout | null>(null)
  const [activePlace, setActivePlace] = useState<string | null>();
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [storeType, setStoreType] = useState<string>('For home & business')
  const [productType, setProductType] = useState<string>('Cooling & Heating');
  const [distanceType, setDistanceType] = useState<string>('km');
  const [distance, setDistance] = useState<number>(10);
  const [searchType, setSearchType] = useState<'simple' | 'advanced'>('simple');
  const [language, setLanguage] = useState<string>('English');
  const [translation, setTranslation] = useState<any>();
  const [zoom, setZoom] = useState<number>(8);
  const [center, setCenter] = useState<any>({ lat: +50.8742724, lon: +0.6619475 });

  const mapRef = React.createRef<React.RefObject<GoogleMap>>();
  const fetchGoogleSheet = async () => {
    await doc.useServiceAccountAuth(require('./SEACE Installer Locator-5a80e6b026be.json'));
  }

  const distanceToTarget = (location: LocationLayout, locationTarget: LocationLayout) => {
    const lat1 = location.lat;
    const lat2 = locationTarget.lat;
    const lon1 = location.lon;
    const lon2 = locationTarget.lon;

    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  const fetchCompaniesForRegion = async (region: string) => {
    try {
      setLoading(true);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[REGION_TO_SHEET_MAP[region]]
      const rows = await sheet.getRows();
      const centerCoords = REGION_TO_COORDS_MAP[region]
      setCompanies(rows);
      // setSearchLocation(centerCoords);

      console.log(rows);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  // Only once
  useEffect(() => { fetchGoogleSheet() });

  // Every region change
  useEffect(() => {
    const fetchTranslations = async (language: string) => {
      try {
        setLoading(true);
        await doc.loadInfo();
        const translations = await doc.sheetsByIndex[0].getRows()

        console.log(language, LANGUAGE_TO_ROW_MAP[language]);


        setTranslation(translations[LANGUAGE_TO_ROW_MAP[language]])

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
    fetchCompaniesForRegion(region);
    fetchTranslations(language);
  }, [language, region]);

  // Every filter change, or when companies load in
  useEffect(() => {
    console.log('here');

    if (companies) {
        const filterCompanies = (companies: Array<CompanyLayout>, distance: number, searchLocation: LocationLayout, storeType: string, productType: string, searchType: string): Array<CompanyLayout> => {

          // Filter on type first for performance
          let filteredCompanies = companies
          if (searchType === 'advanced') {
            if (storeType === 'For home' || storeType === 'For business') {

              console.log({storeType});
              
              filteredCompanies = filteredCompanies.filter(c => c['Installer Type'] === storeType || c['Installer Type'] === 'For home & business');
            }
            if (productType === 'Cooling' || productType === 'Heating') {
              filteredCompanies = filteredCompanies.filter(c => c['Product Type'].toLowerCase() === productType.toLowerCase() || c['Product Type'].toLowerCase() === 'Cooling & Heating'.toLowerCase());
            }
          }

          // Calculate distance
          filteredCompanies = filteredCompanies.map(c => {
            console.log({ storeType: storeType, type: c['Installer Type'] });
            console.log({ lat: parseFloat(String(c['Latitude'])), lon: parseFloat(String(c['Longitude'])) });

            const location = {
              lat: parseFloat(String(c['Latitude'])),
              lon: parseFloat(String(c['Longitude']))
            }
            if (searchLocation) {
              c.distanceToTarget = distanceToTarget(location, searchLocation);
            } else {
              c.distanceToTarget = 0;
            }
            
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
      defaultZoom={zoom}
      // zoom={zoom}
      // center={center}
      defaultCenter={{ lat: 51.8266266, lng: -2.2714084 }}
      ref={mapRef}
    >
      {searchLocation &&
        <Circle
          center={
            {
              lat: searchLocation.lat,
              lng: searchLocation.lon
            }
          }
          radius={distanceType === 'mile' ? (1000 * distance) / 1.609344 : 1000 * distance}
          options={{
            fillColor: "#4C90E38",
            strokeWeight: 0,
            fillOpacity: 0.1,
          }}
        />
      }

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
          onClick={() => {
            mapRef.current.panTo({ lat: parseFloat(String(c['Latitude'])), lng: parseFloat(String(c['Longitude'])) });
            setActivePlace(c['Company name']);
          }}
          icon={{ url: icon }}
          label={{ color: 'white', fontSize: '16px', paddingBottom: '150px', text: (idx + 1).toString() }}
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

  // const _handleZoomChanged = (vars) => {
  //   console.log({vars});
  // }

  // const _handleCenterChanged = () => {
  //   updateMap();
  // }

  // const updateMap = _.throttle((mapRef) => {
  //   const zoomLevel = mapRef.getZoom();
  //   if (zoomLevel !== zoom) {
  //     setZoom(zoomLevel);
  //   }
  //   const newCenter = mapRef.getCenter();
  //   if (!newCenter.equals(center)) {
  //     setCenter(center);
  //   }
  // }, 1000/60);

  return (
    <div>
      <MyMapComponent
        className="map-screen"
        isMarkerShown={true}
        googleMapURL="https://maps.googleapis.com/maps/api/js?client=gme-samsungsds&v=3.exp&libraries=geometry,drawing,places"
        // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      <Filter
        googleMapURL="https://maps.googleapis.com/maps/api/js?client=gme-samsungsds&v=3.exp&libraries=geometry,drawing,places"
        // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        language={language}
        onSubmit={() => { }}
        loading={loading}
        companies={filteredCompanies}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        mapRef={mapRef}
        setActivePlace={setActivePlace}
        setDistance={setDistance}
        setStoreType={setStoreType}
        distanceType={distanceType}
        setDistanceType={setDistanceType}
        setProductType={setProductType}
        searchType={searchType}
        setSearchType={setSearchType}
        translation={translation}
        region={region}
      />

      <MapLegend isOpened={true} />
      <MapRegionIndicator region={region} setRegion={setRegion} setLanguage={setLanguage} searchLocation={searchLocation} translation={translation} />
    </div>
  );
}

export default MapScreen;