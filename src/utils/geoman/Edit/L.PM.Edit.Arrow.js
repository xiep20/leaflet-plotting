import Edit from './L.PM.Edit';
/**
 * 箭头编辑类
 */
Edit.Arrow = Edit.Polygon.extend({
  _shape: 'Arrow',
  _initMarkers() {
    const map = this._map;
    const coords = this._layer._points || this._layer.options._points;

    // cleanup old ones first
    if (this._markerGroup) {
      this._markerGroup.clearLayers();
    }

    // add markerGroup to map, markerGroup includes regular and middle markers
    this._markerGroup = new L.FeatureGroup();
    this._markerGroup._pmTempLayer = true;

    // handle coord-rings (outer, inner, etc)
    const handleRing = (coordsArr) => {
      // if there is another coords ring, go a level deep and do this again
      if (Array.isArray(coordsArr[0])) {
        return coordsArr.map(handleRing, this);
      }

      // the marker array, it includes only the markers of vertexes (no middle markers)
      const ringArr = coordsArr.map(this._createMarker, this);

      // if (this.options.hideMiddleMarkers !== true) {
      //   // create small markers in the middle of the regular markers
      //   coordsArr.map((v, k) => {
      //     // find the next index fist
      //     const nextIndex = this.isPolygon()
      //       ? (k + 1) % coordsArr.length
      //       : k + 1;
      //     // create the marker
      //     return this._createMiddleMarker(ringArr[k], ringArr[nextIndex]);
      //   });
      // }

      return ringArr;
    };

    // create markers
    this._markers = handleRing(coords);

    // handle possible limitation: maximum number of markers
    this.filterMarkerGroup();

    // add markerGroup to map
    map.addLayer(this._markerGroup);
  },
  //编辑结束
  _onMarkerDragEnd(e) {
    const marker = e.target;

    if (!this._vertexValidationDragEnd(marker)) {
      return;
    }

    const { indexPath } = L.PM.Utils.findDeepMarkerIndex(this._markers, marker);

    // if self intersection is not allowed but this edit caused a self intersection,
    // reset and cancel; do not fire events
    let intersection = this.hasSelfIntersection();
    if (
      intersection &&
      this.options.allowSelfIntersectionEdit &&
      this._markerAllowedToDrag
    ) {
      intersection = false;
    }

    const intersectionReset =
      !this.options.allowSelfIntersection && intersection;

    this._fireMarkerDragEnd(e, indexPath, intersectionReset);

    if (intersectionReset) {
      // reset coordinates
      this._layer.setLatLngs(this._coordsBeforeEdit);
      this._coordsBeforeEdit = null;

      // re-enable markers for the new coords
      this._initMarkers();

      if (this.options.snappable) {
        this._initSnappableMarkers();
      }

      // check for selfintersection again (mainly to reset the style)
      this._handleLayerStyle();

      this._fireLayerReset(e, indexPath);
      return;
    }
    if (
      !this.options.allowSelfIntersection &&
      this.options.allowSelfIntersectionEdit
    ) {
      this._handleLayerStyle();
    }
    // fire edit event
    this._fireEdit();
    this._layerEdited = true;
    this._fireChange(this._layer.getLatLngs(), 'Edit');

    //更改箭头面坐标和信息
    let poltCoords = []
    for (let i = 0; i < this._markers.length; i++) {
      poltCoords.push(this._markers[i].getLatLng())
    }
    const polygonLayer = L.Plot.squadCombat(poltCoords)
    this._layer._points = poltCoords
    this._layer.options._points = poltCoords
    this._layer.setLatLngs(polygonLayer.getLatLngs())
  },

});
