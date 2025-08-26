import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useData } from '../../context/DataContext';
import { Helmet } from 'react-helmet-async';
import LoadingCard from '../loadingPage/loadingCard';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapCard = () => {
  const { locations, groups, events, loading, error } = useData();

  if (loading) return <div className="flex items-center mx-auto"><LoadingCard/></div>;
  if (error) return <div className="flex items-center mx-auto"><LoadingCard/></div>;

  const egyptBounds = [[22.0, 25.0], [31.5, 35.0]];

  return (
    <>
      <Helmet>
        <title>Egypt Sports Map - Explore Groups & Events 2025</title>
        <meta name="description" content={`Interactive map of Egypt with ${groups.length} groups and ${events.length} events in 2025 across cities like Cairo, Alexandria, and Luxor.`} />
        <meta name="keywords" content={`Egypt map, groups, events, ${locations.map(l => l.name).join(', ')}, sports, 2025 events`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Egypt Sports Map 2025" />
        <meta property="og:description" content={`Discover ${groups.length} sports groups and ${events.length} events on this interactive Egypt map.`} />
        <meta property="og:image" content="https://yourdomain.com/map-og-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com/map" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Card className="bg-white shadow-lg rounded-none border-0 w-full h-screen mx-auto overflow-hidden pt-11 z-1" role="main">
        <CardContent className="p-0 h-full" aria-label="Interactive map of Egypt showing groups and events">
          <MapContainer
            center={[26.8206, 30.8025]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
            className="rounded-none overflow-hidden"
            maxBounds={egyptBounds}
            maxBoundsViscosity={1.0}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((location) => (
              <Marker key={location.id} position={[location.lat, location.lng]}>
                <Popup className="bg-green-50 text-green-800" role="tooltip">
                  <div className="text-center">
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm">City</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {groups.map((group) => (
              <Marker key={group.id} position={[group.lat, group.lng]} icon={greenIcon}>
                <Popup className="bg-green-50 text-green-800" role="tooltip">
                  <div className="text-center">
                    <h3 className="font-semibold">{group.name}</h3>
                    <p className="text-sm">{group.members} members - {group.sport}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {events.map((event) => (
              <Marker key={event.id} position={[event.lat, event.lng]} icon={greenIcon}>
                <Popup className="bg-green-50 text-green-800" role="tooltip">
                  <div className="text-center">
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm">{event.date} - {event.type}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default MapCard;