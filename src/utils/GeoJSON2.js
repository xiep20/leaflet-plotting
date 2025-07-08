/**
 * 重写GeoJSON（标绘用）
 * 
 **/

export var GeoJSON2 = L.GeoJSON.extend({
    // //初始化
    // initialize: function (geojson, options) {
    //     L.Util.setOptions.setOptions(this, options);

    //     this._layers = {};

    //     if (geojson) {
    //         this.addData(geojson);
    //     }
    // },
    //加载数据方法
    addData: function (geojson) {
        var features = L.Util.isArray(geojson) ? geojson : geojson.features,
            i, len, feature;

        if (features) {
            for (i = 0, len = features.length; i < len; i++) {
                // only add this if geometry or geometries are set and not null
                feature = features[i];
                if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
                    this.addData(feature);
                }
            }
            return this;
        }

        var options = this.options;

        if (options.filter && !options.filter(geojson)) { return this; }

        var layer = geometryToLayer(geojson, options);
        if (!layer) {
            return this;
        }
        layer.feature = GeoJSON2.asFeature(geojson);

        layer.defaultOptions = layer.options;
        this.resetStyle(layer);

        if (options.onEachFeature) {
            options.onEachFeature(geojson, layer);
        }

        return this.addLayer(layer);
    },
})

// geometry到图层
function geometryToLayer(geojson, options) {

    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
        coords = geometry ? geometry.coordinates : null,
        layers = [],
        pointToLayer = options && options.pointToLayer,
        _coordsToLatLng = options && options.coordsToLatLng || GeoJSON2.coordsToLatLng,
        latlng, latlngs, i, len;

    if (!coords && !geometry) {
        return null;
    }

    switch (geometry.type) {
        case 'Point':
            latlng = _coordsToLatLng(coords);
            return _pointToLayer(pointToLayer, geojson, latlng, options);

        case 'MultiPoint':
            for (i = 0, len = coords.length; i < len; i++) {
                latlng = _coordsToLatLng(coords[i]);
                layers.push(_pointToLayer(pointToLayer, geojson, latlng, options));
            }
            return new L.FeatureGroup(layers);

        case 'LineString':
        case 'MultiLineString':
            latlngs = GeoJSON2.coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
            return new L.Polyline(latlngs, options);

        case 'Polygon':
        case 'MultiPolygon':
            latlngs = GeoJSON2.coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
            //箭头面判断
            if (geojson.properties && geojson.properties.shape && geojson.properties.shape === "Arrow") {
                options._type2 = "Arrow"
            }
            return new L.Polygon(latlngs, options);

        case 'GeometryCollection':
            for (i = 0, len = geometry.geometries.length; i < len; i++) {
                var geoLayer = geometryToLayer({
                    geometry: geometry.geometries[i],
                    type: 'Feature',
                    properties: geojson.properties
                }, options);

                if (geoLayer) {
                    layers.push(geoLayer);
                }
            }
            return new L.FeatureGroup(layers);

        case 'FeatureCollection':
            for (i = 0, len = geometry.features.length; i < len; i++) {
                var featureLayer = geometryToLayer(geometry.features[i], options);

                if (featureLayer) {
                    layers.push(featureLayer);
                }
            }
            return new L.FeatureGroup(layers);

        default:
            throw new Error('Invalid GeoJSON object.');
    }
}

// //点到图层
function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
    return pointToLayerFn ?
        pointToLayerFn(geojson, latlng) :
        new L.Marker(latlng, options && options.markersInheritOptions && options);
}

