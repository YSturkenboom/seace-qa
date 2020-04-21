import React, { useState, useEffect } from 'react';
import { Button, Radio, Card, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { FilterTextField } from './form/FilterTextField';
import { LocationCard } from './form/LocationCard';
import { Search } from '@material-ui/icons';
import { CompanyLayout, LocationLayout } from '../interfaces';

interface Values {
    address: string;
    distanceInKilometers: number;
}
  
interface Props {
    onSubmit: (values: Values) => void;
    companies: Array<CompanyLayout> | null;
    loading: boolean;
    searchLocation: LocationLayout | null;
}

const distanceToTarget = (location: LocationLayout, locationTarget: LocationLayout) => {

    // TODO: Replace with maps distance
    var a = location.lat - locationTarget.lat;
    var b = location.lon - locationTarget.lon;    
    return Math.sqrt( a*a + b*b );
};

const filterCompanies = (companies: Array<CompanyLayout>, distance: number, searchLocation: LocationLayout, storeType: string, searchType: string): Array<CompanyLayout> => {
    // Filter on type first for performance
    let filteredCompanies = companies
    if (searchType === 'advanced' && (storeType === 'For home' || storeType === 'For business')) {
        filteredCompanies =  filteredCompanies.filter(c => c['Installer Type'] === storeType || c['Installer Type'] === 'For home & business');
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

export const Filter: React.FC<Props> = ({ onSubmit, loading, companies, searchLocation }) => {
    const [distance, setDistance] = useState<number>(10);
    const [filteredCompanies, setFilteredCompanies] = useState(companies);
    const [searchType, setSearchType] = useState<'simple' | 'advanced'>('simple');
    const [advDropDownIsOpen, setadvDropDownIsOpen] = useState<boolean>(true);
    const [storeType, setStoreType] = useState<string>('For home & business')

    // Every filter change, or when companies load in
    useEffect(() => {
        if (companies && searchLocation) {
            setFilteredCompanies(filterCompanies(companies, distance, searchLocation, storeType, searchType));
        }
    }, [distance, searchLocation, companies, storeType, searchType]);

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

                                <RadioGroup row onChange={e => setDistance(parseInt(e.target.value))}  aria-label="position" name="position" defaultValue="top" className="map-search-box-form-distance">
                                    <FormControlLabel
                                        value="0.1"
                                        control={<Radio color="primary" />}
                                        label="1 mile"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio color="primary" />}
                                        label="2 miles"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="5"
                                        control={<Radio color="primary" />}
                                        label="5 miles"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="10"
                                        control={<Radio color="primary" />}
                                        label="10 miles"
                                        labelPlacement="top"
                                    />
                                </RadioGroup>
                        </Form>
                    )}
                    
                </Formik>
            </div>

            {searchType === 'advanced' &&
                <div className="map-search-box-advanced">
                    <p>Store Type</p>
                    <Button onClick={() => setadvDropDownIsOpen(!advDropDownIsOpen)}>
                        {advDropDownIsOpen ? '-' : '+'}
                    </Button>
                    {advDropDownIsOpen &&
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
                </div>
            }

            <div className="map-search-box-footer">
                {loading ? (
                    'Loading...'
                ) : (
                    <div>
                        {filteredCompanies && filteredCompanies.map(c =>
                            <LocationCard
                                name={c['Company name']}
                                telephone={c['Phone number']}
                                address={c['Street Address']}
                                distance={c.distanceToTarget}
                            />
                        )}
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