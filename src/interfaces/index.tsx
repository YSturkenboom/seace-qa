export interface CompanyLayout {
    'Company name': string;
    'Phone number': string | number;
    'Street Address': string;
    'Latitude': string | number;
    'Longitude': string | number;
    'Installer Type': string;
    'Product Type': string;
    distanceToTarget: number;
};

export interface LocationLayout {lat: number, lon: number};
