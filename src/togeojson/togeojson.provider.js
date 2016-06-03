import factory from './togeojson.factory';

function osmtogeojsonProvider() {
    this.options = {
        areaTags: ['area', 'building', 'leisure', 'tourism', 'ruins', 'historic', 'landuse', 'military', 'natural', 'sport'],
        uninterestingTags: ['source', 'source_ref', 'source:ref', 'history', 'attribution', 'created_by', 'tiger:county', 'tiger:tlid', 'tiger:upload_uuid'],
        styles: {}
    };
    this.$get = function () {
        return factory(this.options);
    };
}
export default osmtogeojsonProvider;