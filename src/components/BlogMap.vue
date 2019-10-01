<template>
  <div class="blog-map">
    <googlemaps-map
      ref="map"
      :center="center"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="setCenter"
      @update:zoom="setZoom">
    </googlemaps-map>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
    mapGetters,
    mapActions } = createNamespacedHelpers('maps')

export default {
    computed: {
        ...mapGetters([
            'center',
            'zoom',
        ]),
        mapOptions() {
            return {
                fullscreenControl: false,
            }
        },
    },
    methods: mapActions([
        'setCenter', 
        'setZoom'
    ]),
}
</script>
