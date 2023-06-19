import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import {defaults} from 'ol/control/defaults';
import ScaleLine from 'ol/control/ScaleLine.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import {Fill, Stroke, Style} from 'ol/style.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Icon from 'ol/style/Icon.js';
import Overlay from 'ol/Overlay.js';

// CREATION DE LA CARTE

// Création de la carte dans l'élément "map" avec fond de carte OSM
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  // Centrage de la carte sur Paris avec zoom
  view: new View({
    center: fromLonLat([2.3, 48.87]),
    zoom: 12
  }),
  // Ajout de l'échelle linéaire
  controls: defaults().extend([
    new ScaleLine(),
  ]),
});

// PREMIERE COUCHE : LES ARRONDISSEMENTS DE PARIS

// Objet geojson des arrondissements de Paris
var arrondissements = JSON.parse(arrondissementsGeoJson);

// Création d'une liste de features à partir du GeoJson
var arrondissementGeoJson = new GeoJSON().readFeatures(arrondissements, {
  featureProjection: "EPSG:3857"
});

// Création d'une source vectorielle de donnée
const arrondissementSource = new VectorSource({
  features: arrondissementGeoJson
})

// Génération aléatoire des couleurs avec une opacity à 0.7, retourne une liste rgba
const getRandomColorWithOpacity = () => {
  // Génère une couleur aléatoire hexadecimal
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  var opacity = 0.7;
  // Converti une couleur hexadecimal en couleur RGBA dans une liste
  return [
    parseInt(randomColor.slice(0, 2), 16), 
    parseInt(randomColor.slice(2, 4), 16), 
    parseInt(randomColor.slice(4, 6), 16), 
    opacity
  ];
}

var colors = {};

// Ajout d'une couleur aléatoire à partir de la fonction "getRandomColorWithOpacity" pour chaque arrondissement 
for (var code_arr = 1; code_arr <= 20; code_arr++) {
  var randomColor = getRandomColorWithOpacity();
  colors[code_arr] = randomColor;
}

// Retourne les couleurs dynamiquement sur la carte 
var styleArrondissement = (feature) => {
  // Récupération de la prorpiété "c_ar" faisant référence au code arrondissement
  var featureArrondissement = feature.get('c_ar');

  // Correspondance des couleurs pour chaque arrondissement
  var featureColor = colors[featureArrondissement];

  // Retourne l'objet Style avec les propriétés définies
  return new Style({
    stroke: new Stroke({
      color: "#cccccc",
      width: 1
    }),
    fill: new Fill({
      color: featureColor,
    })
  });
};

// Création de la couche arrondissement avec sa source et son style
var arrondissementLayer = new VectorLayer({
  source: arrondissementSource,
  style: styleArrondissement,
});

// Rend la couche arrondissement invisible lors du démarrage
arrondissementLayer.setVisible(false);

// Ciblage de l'élément HTML du checkbox
var arrondissementCheckBox = document.getElementById("arrondissement-paris");
// Ajout d'un événement click lorsqu'on click sur la checkbox arrondissement
arrondissementCheckBox.addEventListener('click', (e) => {
  // Lors du click, rend visible la couche si TRUE sinon invisible si False
  arrondissementLayer.setVisible(e.target.checked);
})

// Ajout des couches
map.addLayer(arrondissementLayer);

// DEUXIEME COUCHE : LES STATIONS DE METRO

// Création d'une classe Station
class Station {
  // Constructeur de la classe avec ses paramètres
  constructor(name, line, lon, lat) {
    this.name = name;
    this.line = line;
    this.lon = lon;
    this.lat = lat
  }

  // Méthode de classe
  getDescription () {
    return (
      `
      nom : ${this.name}</br>
      ligne : ${this.line}</br>
      longitude : ${this.lon}</br>
      latitude : ${this.lat}
      `
    )
  }
}

// Requête HTTP asynchrone sur le fichier CSV pour récupérer les données des stations
const request = new XMLHttpRequest();
// Chemin relatif du fichier CSV pour la requête
const fichierCSV = '../data/metro-paris.csv';
// Nombre de stations à extraire aléatoirement dans le fichier CSV
var nombreStation = 10;

// Requête HTTP asynchrone (via le paramètre true) de type GET sur le fichier csv, 
request.open('GET', fichierCSV, true);
// Fonction qui est appelé à chaque changement d'état
request.onreadystatechange = function() {
  // Vérifie si la requête est terminé ou réussi (200 OK)
  if (request.readyState === 4 && request.status === 200) {
    // Tout le contenue du CSV dans cette variable, on split pour obtenir la ligne qu'on souhaite
    var contenueCSV = request.responseText.split('\n');
    // Boucle sur 10 stations en sélectionnant une stations aléatoire en fonction de la ligne dans le CSV
    for (var station = 1; station <= nombreStation; station++){
      // Extraction d'une ligne aléatoire dans le CSV
      var numeroLigne = Math.floor(Math.random() * contenueCSV.length) + 1
      // Extraction de station aléatoire
      var stationExtraite = contenueCSV[numeroLigne];
      // Supprime la ligne extraite pour éviter les doublons
      contenueCSV.splice(numeroLigne, 1); 
      // Stock le résultat dans le local storage afin de conserver les valeurs hors fonction asynchrone
      localStorage.setItem(`ligne n°${station}`, stationExtraite)
    }
  }
};
// Recupère la requête HTTP pour récupérer le contenu
request.send();

var stations = []
// Boucle permettant de stocker dans la liste "stations", les instances de chaque Stations
for (var eachStation = 1; eachStation <= nombreStation; eachStation++) {
  // Récupère les éléments du local storage
  var getStation = localStorage.getItem(`ligne n°${eachStation}`);
  // Nettoye le contenu notamment en supprimant les "\r" et les espaces avec les regex
  var replaceLine = getStation.replace(/[\r\s]/g,'');
  // Split afin d'extraire chaque élément
  var splitStringStation = replaceLine.split(',')
  // Instanciation d'objets avec chaque contenue de paramètre
  var instanceStation = new Station(
    splitStringStation[2], // Nom de la station
    splitStringStation[3], // Ligne de la station
    parseFloat(splitStringStation[1]), // Longitude de la station en valeur numérique float
    parseFloat(splitStringStation[0])); // Latitude de la station en valeur numérique float
  // Stocke les objets dans une liste "stations"
  stations.push(instanceStation);
}

console.log(stations);

// Création d'une liste de features
var stationFeatures = [];

for (var i = 0; i < stations.length; i++) {
  // Stocke chaque instance dans la variable station
  var station = stations[i];
  var lon = station.lon;
  var lat = station.lat;
  var coords = [lon, lat];
  var projectionCoords = fromLonLat(coords);
  // Création d'un nouvel objet pour styliser l'icon
  var iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: "./img/pin.png",
      // Définie la couleur en fonction de la variable "colors" pour chaque features  
      color: [colors[i+1][0],colors[i+1][1], colors[i+1][2]]
    })
  });

  // Création d'un objet à dimension géographique (géométrie)
  var featureStation = new Feature({
    geometry: new Point(projectionCoords),
    name: station.name,
    // Description de la station avec la méthode de classe
    details: station.getDescription()
  });
  // Style de l'entité géographique
  featureStation.setStyle(iconStyle);
  stationFeatures.push(featureStation);
}

console.log(stationFeatures);

var stationLayerSource = new VectorSource({
  features: stationFeatures,
  name: "stations-source"
});

var stationLayer = new VectorLayer({
  source: stationLayerSource,
  id: "stations"
});

stationLayer.setVisible(false);

var stationCheckBox = document.getElementById("stations-metro");
stationCheckBox.addEventListener('click', (e) => {
  stationLayer.setVisible(e.target.checked);
})

map.addLayer(stationLayer);

// POPUP AVEC LA DESCRIPTION DE LA STATION

// Création de la popup
var popup = new Overlay({
  // l'element HTML de la popup
  element: document.getElementById('map-popup'),
  positioning: 'bottom-center',
  offset: [0,-45]
});

map.addOverlay(popup);

// Ferme la popup
function closePopup() {
  popup.setPosition(undefined);
}

// Ferme la popup lors du click sur la croix
document.getElementById('popup-closer').addEventListener('click', () => {closePopup()});

// Evenement du click sur la carte
map.on('click', function (event) {
  // Fermer la popup
  closePopup();
  // Chercher la feature
  map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
    // Si la feature existe
    if (feature) {
      if (layer) {
        var layerId = layer.get('id');
        if (layerId === 'stations') {
          // Récupère les coordonnées
          var coordinates = feature.getGeometry().getCoordinates();
          // Modifie la position de la popup
          popup.setPosition(coordinates);
          // Modifie le contenu de la popup, affiche le details de l'objet featureSation
          document.getElementById('map-popup-content').innerHTML= `${feature.values_.details}`;
        }
      }
    }
  });     
});