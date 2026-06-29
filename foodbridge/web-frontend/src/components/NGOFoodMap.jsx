import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Icons
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = createIcon('blue'); // NGO / Current User
const redIcon = createIcon('red');   // Provider / Food

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const NGOFoodMap = ({ listings, userLocation }) => {
    const [map, setMap] = React.useState(null);

    // Validate if userLocation is a valid [lat, lng] array
    const isValidLocation = Array.isArray(userLocation) &&
        userLocation.length === 2 &&
        typeof userLocation[0] === 'number' &&
        typeof userLocation[1] === 'number';

    const defaultCenter = isValidLocation ? userLocation : [20.5937, 78.9629];

    const handleLocateMe = () => {
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
            });
        }
    };

    return (
        <div className="h-[500px] w-full rounded-[2rem] overflow-hidden shadow-xl border-4 border-white relative">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                ref={setMap}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={defaultCenter} />

                {/* User Mark */}
                {userLocation && (
                    <Marker position={userLocation} icon={blueIcon}>
                        <Popup>
                            <div className="font-bold">You are here</div>
                        </Popup>
                    </Marker>
                )}

                {/* Food Listings */}
                {listings.map((item) => (
                    item.location?.coordinates && (
                        <Marker
                            key={item._id}
                            position={[item.location.coordinates[1], item.location.coordinates[0]]}
                            icon={redIcon}
                        >
                            <Popup className="food-popup">
                                <div className="p-2">
                                    <img
                                        src={item.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={item.foodName}
                                        className="w-full h-24 object-cover rounded-xl mb-2"
                                    />
                                    <h3 className="font-black text-slate-900">{item.foodName}</h3>
                                    <p className="text-xs text-slate-500 mb-2">{item.category} • {item.quantity} {item.unit}</p>
                                    <button
                                        onClick={() => window.location.href = `/ngo/listing/${item._id}`}
                                        className="w-full bg-green-600 text-white text-xs font-bold py-2 rounded-lg"
                                    >
                                        Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {/* Locate Me Button */}
            <button
                onClick={handleLocateMe}
                className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-2xl shadow-2xl hover:bg-slate-50 border border-slate-100 transition-all active:scale-95"
                title="Locate Me"
            >
                <span className="text-xl">📍</span>
            </button>
        </div>
    );
};

export default NGOFoodMap;
