# **Langages Web 3 ( JavaScript avancé )** 🌐

## **Projet final**

### Présentation

L’objectif de ce projet est de créer **une carte web du metro de Paris** avec les couches suivantes :

- Une couche de type raster : **un fond de carte Openstreetmaps**
- Une couche de polygones : **Les arrondissements de Paris**
- Une couche avec 10 stations de metro

Le répertoire du projet est composé de :

- Le fichier **index.html** : le code HTML du projet
- Un dossier **/data** : contient le fichier de données

  - **arrondissements.js** : le geojson des arrondissements de Paris **(NE PAS MODIFIER)**
  - **metro-paris.csv** : les stations du metro de Paris

- Le dossier **/js** :

  - **app.js** : contient la déclaration des variables de données geojson

Le projet est basé sur les frameworks :

- Openlayers v6.5.0
- Bootstrap v 4.6.0

Les propriétés des objets geojson :

- **arrondissements** :

  - **c_ar** : le code arrondissement
  - l_aroff
  - surface
  - l_ar
  - n_sq_co
  - c_arinsee
  - geom_x_y
  - n_sq_ar
  - perimetre

### Création de la carte

1. Créer une carte openlayers dans l'élément html _#map_ avec les options suivantes:
   - Le fond de carte OpenStreetMaps
   - Une vue centrée sur Paris
   - Un contrôleur de carte: l'échelle linéaire

### Première couche : Les arrondissements de Paris

1. Transformer l'objet geojson **arrondissements** _( voir app.js )_ à une couche de type vecteur avec le style suivant :

   - Bordure :
     - largeur : **1** ( pixel )
     - couleur : **#cccccc**
   - Remplissage :
     - opacité : **0.7**
     - couleur : utiliser **une couleur déferente pour chaque arrondissement**.

   > **_NOTE :_** Après la transformation de l'objet geojson **arrondissements** à une liste de features. Chaque **feature** possèdera la propriété **c_ar** ( code arrondissement ). Utilisez cette propriété pour modifier la couleur du style.

2. Ajouter la couche des arrondissements à la carte et lier sa visibilité à la checkbox **_Arrondissements_**.

### Deuxième couche : Les stations du metro

1. Créer la classe **Station** avec les propriétés et les méthodes suivantes:

   - **Les propriétés**

     - **name:** Le nom
     - **line:** Le numero de la ligne
     - **lon:** La longitude
     - **lat:** La latitude

   - **Les méthodes**
     - **getDescription:** retourne une description de la station _( une chaîne de caractères )_

2. Choisir 10 stations depuis la liste disponible dans le fichier **_/data/metro-paris.csv_**

3. Transformer la liste des stations choisies à une liste d'objets de type **Station**.

4. Transformer **la liste des objets de type Station** à une **couche de type vecteur** _(utiliser une couleur différente pour chaque **ligne**)_

5. Ajouter **la couche des stations** à la carte et lier sa visibilité à la checkbox **_Stations_**.

### Popup avec la description de la station (Bonus)

1. Ajouter le code HTML de la popup au fichier _index.html_

   ```diff
       ...
       <main class="h-100 row m-0 p-0">
           <div id="map" class="h-100 col-9 m-0 p-0">
               <!-- map container -->
           </div>
           <div class="h-100 col-3 m-0 p-2">
               <!-- la liste des couches -->
               <div class="card mt-3">
                    <div class="card-header">La liste des couches :</div>
                    <div class="card-body">
                        <div class="form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="stations-metro"
                            />
                            <label class="form-check-label" for="stations-metro">
                                Stations
                            </label>
                        </div>
                        <div class="form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="arrondissement-paris"
                            />
                            <label class="form-check-label" for="arrondissement-paris">
                                Arrondissements
                            </label>
                        </div>
                    </div>
               </div>
   +           <div id="map-popup" class="ol-popup">
   +               <a
   +                   href="#"
   +                   id="popup-closer"
   +                   class="ol-popup-closer"
   +               ></a>
   +               <div id="map-popup-content"></div>
   +           </div>
           </div>
       </main>
       ...
   ```

2. Ajouter une popup avec les propriétés suivantes :
   - Affichage : lier à l'événement click sur le point de la station
   - Contenu : la description retournée par la méthode **getDescription**
   - Fermeture : lier à l'événement click sur le bouton "X" dans la popup _( #popup-closer )_
