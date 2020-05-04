/// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Button, Radio, Card, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { FilterTextField } from './form/FilterTextField';
import { LocationCard } from './form/LocationCard';
import { Search, Place } from '@material-ui/icons';
import { CompanyLayout, LocationLayout } from '../interfaces';
import { GoogleMap, withScriptjs } from "react-google-maps"
import Autocomplete from 'react-google-autocomplete';



interface Values {
    address: string;
    distanceInKilometers: number;
}
  
interface Props {
    onSubmit: (values: Values) => void;
    companies: Array<CompanyLayout> | null;
    loading: boolean;
    searchLocation: LocationLayout | null;
    setSearchLocation: React.Dispatch<React.SetStateAction<LocationLayout | null>>;
    mapRef: React.RefObject<GoogleMap>;
    setActivePlace: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setDistance: React.Dispatch<React.SetStateAction<number | null | undefined>>;
    distanceType: 'mile' | 'km';
    setStoreType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setDistanceType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setProductType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    searchType: string;
    setSearchType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    language: string;
    translation: any;
}

export const Filter: React.FC<Props> = withScriptjs(
    ({ 
        onSubmit,
        loading,
        companies,
        searchLocation,
        setSearchLocation,
        mapRef,
        setActivePlace,
        setDistance,
        setStoreType,
        distanceType,
        setDistanceType,
        setProductType,
        searchType,
        setSearchType,
        language,
        translation,
        region
    }) => {
    const [storeTypeDropDownIsOpen, setStoreTypeDropDownIsOpen] = useState<boolean>(true);
    const [productTypeDropDownIsOpen, setProductTypeDropDownIsOpen] = useState<boolean>(true);

    return (
        <Card raised className="map-search-box">
            <div className="map-search-box-header">
                <h1 className="map-search-box-heading">Installer Locator</h1>
                <p>Information on this page is subject to change without prior notice. Please contact the installer directly for up to date information.</p>
            </div>
            
            <div>
                <div className="map-search-box-form-searchtype">
                    <Button 
                        onClick={() => setSearchType("simple")}
                        className={"map-search-box-form-distance-btn" + (searchType === 'simple' ? " btn-active" : '')}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => setSearchType("advanced")}
                        className={"map-search-box-form-distance-btn" + (searchType !== 'simple' ? " btn-active" : '')}
                    >
                        Advanced Search
                    </Button>
                </div>

                <Formik 
                    initialValues={{
                        address: "",
                        distanceInKilometers: 10,
                    }}
                    onSubmit={onSubmit}
                >
                    {({ values }) => (
                        <Form className="map-search-box-form">
                                <div className="map-search-box-form-search">
                                    {/* <Field
                                        name="address"
                                        placeholder="Address or post code..."
                                        component={FilterTextField}
                                        className="map-search-box-form-search"
                                    /> */}
                                    <Autocomplete
                                        className="map-search-box-form-search MuiInputBase-input MuiInput-input"
                                        onPlaceSelected={(place) => {
                                            if (place && place.geometry) { 
                                                setSearchLocation({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
                                            }
                                          }}
                                        // types={['(regions)']}
                                        types= {['address']}
                                    />
                                    {searchLocation && <Button className="clear-search" onClick={() => setSearchLocation(null)}>✕</Button>}

                                    {/* <Autocomplete
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            paddingLeft: '16px',
                                            marginTop: '2px',
                                            marginBottom: '500px'
                                        }}
                                        onPlaceSelected={onPlaceSelected}
                                        types={['(regions)']}
                                    /> */}
                                    <Button type="submit">
                                        <Search> </Search>
                                    </Button>
                                </div>

                                <RadioGroup row onChange={e => setDistance(parseInt(e.target.value))} aria-label="position" name="distance" defaultValue="10" className="map-search-box-form-distance custom-radio">
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio color="primary" />}
                                        label="1"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio color="primary" />}
                                        label="2"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="5"
                                        control={<Radio color="primary" />}
                                        label="5"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="10"
                                        control={<Radio color="primary" />}
                                        label="10"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="25"
                                        control={<Radio color="primary" />}
                                        label="25"
                                        labelPlacement="top"
                                    />
                                </RadioGroup>
                                <RadioGroup row onChange={e => setDistanceType(e.target.value)} aria-label="position" name="type" defaultValue="km" className="mt-2 map-search-box-form-distance">
                                    <FormControlLabel
                                        value="km"
                                        control={<Radio color="primary" />}
                                        label="km"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="mile"
                                        control={<Radio color="primary" />}
                                        label="miles"
                                        labelPlacement="top"
                                    />
                            </RadioGroup>
                        </Form>
                    )}
                    
                </Formik>
            </div>

            {searchType === 'advanced' && 
                <div className="map-search-box-advanced">
                    <div className="map-search-box-advanced-header">
                        <p>Installer Type</p>
                        <Button onClick={() => setStoreTypeDropDownIsOpen(!storeTypeDropDownIsOpen)}>
                            {storeTypeDropDownIsOpen ? '-' : '+'}
                        </Button>
                    </div>
                    {storeTypeDropDownIsOpen && translation &&
                        <RadioGroup onChange={e => setStoreType(e.target.value)} aria-label="position" name="position" defaultValue="For home and business">
                            <FormControlLabel
                                value="For home"
                                control={<Radio color="primary" />}
                                label={translation["For home"]}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="For business"
                                control={<Radio color="primary" />}
                                label={translation["For business"]}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="For home & business"
                                control={<Radio color="primary" />}
                                label={translation['For home & business']}
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    }
                    <div className="map-search-box-advanced-header">
                        <p>Product Type</p>
                        <Button onClick={() => setProductTypeDropDownIsOpen(!productTypeDropDownIsOpen)}>
                            {productTypeDropDownIsOpen ? '-' : '+'}
                        </Button>
                    </div>
                    {productTypeDropDownIsOpen &&
                        <RadioGroup onChange={e => setProductType(e.target.value)} aria-label="position" name="position" defaultValue="Cooling & Heating">
                            <FormControlLabel
                                value="Cooling"
                                control={<Radio color="primary" />}
                                label={translation["Cooling"]}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="Heating"
                                control={<Radio color="primary" />}
                                label={translation["Heating"]}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="Cooling & Heating"
                                control={<Radio color="primary" />}
                                label={translation["Cooling & Heating"]}
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    }
            </div>
            }

            <div className="map-search-box-footer" style={searchType === 'advanced' ? {height: '130px'} : {}}>
                {loading ? (
                    'Loading...'
                ) : (
                    <div>
                        {companies && companies.length ? companies.map((c, idx) =>
                            <LocationCard
                                number={idx}
                                name={c['Company name']}
                                telephone={c['Phone number']}
                                address={c['Street Address']}
                                distance={c.distanceToTarget}
                                distanceType={distanceType}
                                mapRef={mapRef}
                                lat={parseFloat(String(c['Latitude']))}
                                lon={parseFloat(String(c['Longitude']))}
                                setActivePlace={setActivePlace}
                                installerType={c['Installer Type']}
                                translation={translation}
                            />
                        ) : "No installers found. Please broaden your search criteria."}
                    </div>
                )}
            </div>
        </Card>
    );
})

            /* <p>Text</p>
            <div>
                <button onClick={}>Search</button>
                <button>Advanced search</button>
            </div>
            <input onChange={(e) => setQuery(e.target.value)} value={query} placeholder={'Postcode or address...'} /> */