/**
 * @module osm.x2js
 */
var osmx2jsModule = angular.module('osm.x2js', [])
.provider('osmx2js', function osmx2jsProvider () {
    this.options = {};
    this.$get = function osmx2jsFactory() {
        return new X2JS(this.options); //X2JS must be global
    };
});

export default osmx2jsModule;
