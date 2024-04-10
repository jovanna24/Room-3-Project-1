Radar.initialize('prj_test_pk_46aed3ba8dcbae2e29b726476e62a678b9f18148');

// create a map
const map = Radar.ui.map({
  container: 'map',
  style: 'radar-default-v1',
  center: [-112.0740, 33.4484], // NYC
  zoom: 11
});

const marker = Radar.ui.marker({ text: 'Location' })
  .setLngLat([-112.0740, 33.4484])
  .addTo(map);
