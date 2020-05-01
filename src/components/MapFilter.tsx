import React, { useState, useEffect } from 'react';
import { Button, Radio, Card, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { FilterTextField } from './form/FilterTextField';
import { LocationCard } from './form/LocationCard';
import { Search } from '@material-ui/icons';
import { CompanyLayout, LocationLayout } from '../interfaces';
import { GoogleMap } from "react-google-maps"


interface Values {
    address: string;
    distanceInKilometers: number;
}
  
interface Props {
    onSubmit: (values: Values) => void;
    companies: Array<CompanyLayout> | null;
    loading: boolean;
    searchLocation: LocationLayout | null;
    mapRef: React.RefObject<GoogleMap>;
    setActivePlace: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setDistance: React.Dispatch<React.SetStateAction<number | null | undefined>>;
    distanceType: 'mile' | 'km';
    setStoreType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setDistanceType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setProductType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    searchType: string;
    setSearchType: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export const Filter: React.FC<Props> = ({ 
    onSubmit,
    loading,
    companies,
    searchLocation,
    mapRef,
    setActivePlace,
    setDistance,
    setStoreType,
    distanceType,
    setDistanceType,
    setProductType,
    searchType,
    setSearchType
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
                                    <Field
                                        name="address"
                                        placeholder="Address or post code..."
                                        component={FilterTextField}
                                        className="map-search-box-form-search"
                                    />
                                    <Button type="submit">
                                        <Search> </Search>
                                    </Button>
                                </div>

                                <RadioGroup row onChange={e => setDistance(parseInt(e.target.value))}  aria-label="position" name="distance" defaultValue="10" className="map-search-box-form-distance">
                                    <FormControlLabel
                                        value="10"
                                        control={<Radio color="primary" />}
                                        label="1 mile"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="20"
                                        control={<Radio color="primary" />}
                                        label="2 miles"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="50"
                                        control={<Radio color="primary" />}
                                        label="5 miles"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="100"
                                        control={<Radio color="primary" />}
                                        label="10 miles"
                                        labelPlacement="top"
                                    />
                                </RadioGroup>
                                <RadioGroup row onChange={e => setDistanceType(e.target.value)} aria-label="position" name="type" defaultValue="km" className="map-search-box-form-distance">
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
                        <p>Store Type</p>
                        <Button onClick={() => setStoreTypeDropDownIsOpen(!storeTypeDropDownIsOpen)}>
                            {storeTypeDropDownIsOpen ? '-' : '+'}
                        </Button>
                    </div>
                    {storeTypeDropDownIsOpen &&
                        <RadioGroup onChange={e => setStoreType(e.target.value)} aria-label="position" name="position" defaultValue="For home and business">
                            <FormControlLabel
                                value="For home"
                                control={<Radio color="primary" />}
                                label="For Home"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="For business"
                                control={<Radio color="primary" />}
                                label="For Business"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value='For home & business'
                                control={<Radio color="primary" />}
                                label="For Home & Business"
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
                                label="Cooling"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="Heating"
                                control={<Radio color="primary" />}
                                label="Heating"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value='Cooling & Heating'
                                control={<Radio color="primary" />}
                                label="Cooling & Heating"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    }
            </div>
            }

            <div className="map-search-box-footer">
                {loading ? (
                    'Loading...'
                ) : (
                    <div>
                        {companies ? companies.map(c =>
                            <LocationCard
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
                            />
                        ) : "No installers found. Please broaden your search criteria"}
                    </div>
                )}
            </div>
        </Card>
    );
}

            /* <p>Text</p>
            <div>
                <button onClick={}>Search</button>
                <button>Advanced search</button>
            </div>
            <input onChange={(e) => setQuery(e.target.value)} value={query} placeholder={'Postcode or address...'} /> */