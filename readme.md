# Basic JavaScript project with OpenLayers and NodeJS

## Presentation

Simple project using the `OpenLayers` library and `NodeJS`: 

The aim of this project is to create a **dynamic map of the Paris metro system** :

- Creation of an OpenStreetMap base map, centered on Paris
- Add several layers : raster and polygon
- Layer styling (color, size, etc.)
- Display 10 random objects from database: **data/metro-paris.csv**
- Display a popup for each object (name, line, lon, lat)

## Data

The data are located in the data directory :
<pre>
📦openlayers_project
 ┣ 📂data
 ┃ ┣ 📜arrondissements.js
 ┃ ┗ 📜metro-paris.csv
</pre>

- **arrondissements.js** : Paris arrondissements geojson
- **metro-paris.csv** : Paris subway stations

## Dependencies

The project is based on the frameworks and development environments:
- Openlayers **v7.4.0**
- Bootstrap **v4.6.0**
- Vite **v4.3.9**

## Run locally

1. Clone project

    - git clone https://github.com/WLaurent-Hub/openlayers_project.git

2. Installing dependencies

    - cd projet_JS3_OL
    - npm install

3. Open a local server

    - npm run dev
