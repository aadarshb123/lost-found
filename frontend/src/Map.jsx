import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import ReportItemForm from './components/ReportItemForm';
import ItemDetailOverlay from './components/ItemDetailOverlay';
import { createItem, getItems } from './utils/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import './Map.css';

const googleMapsApiKey = 'AIzaSyDrl5HtC_bvZ1Df3Tb5lCrhS6-DHE5PbR4';

// Define libraries outside the component to prevent recreation on each render
const libraries = ['marker', 'visualization'];

const Map = () => {
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerClusterer, setMarkerClusterer] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const navigate = useNavigate();

  const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 60px)',
  };

  const center = {
    lat: 33.776,
    lng: -84.399,
  };

  // Get marker icons - only call this after Google Maps is loaded
  const getMarkerIcons = () => {
    if (!window.google) return null;
    
    return {
      default: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#B3A369',
        fillOpacity: 1,
        strokeColor: '#003057',
        strokeWeight: 2,
        scale: 10
      },
      lost: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#FF5252',
        fillOpacity: 1,
        strokeColor: '#D32F2F',
        strokeWeight: 2,
        scale: 10
      },
      found: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#4CAF50',
        fillOpacity: 1,
        strokeColor: '#2E7D32',
        strokeWeight: 2,
        scale: 10
      }
    };
  };

  useEffect(() => {
    const initialPins = [
      { id: 1, lat: 33.772509, lng: -84.392861, building: 'Bobby Dodd Stadium', items: [] },
      { id: 2, lat: 33.773971, lng: -84.398806, building: 'Student Center', items: [] },
      { id: 3, lat: 33.77471, lng: -84.39629, building: 'CULC', items: [] },
      { id: 4, lat: 33.77738, lng: -84.39622, building: 'Klaus', items: [] },
      { id: 5, lat: 33.77543, lng: -84.40138, building: 'Instructional Center', items: [] },
      { id: 6, lat: 33.77564, lng: -84.40410, building: 'CRC', items: [] },
      { id: 7, lat: 33.77001, lng: -84.39148, building: 'North Ave Apartments', items: [] },
    ];
    setPins(initialPins);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getItems();
        const items = response.items;
        
        // Update pins with items
        setPins(prevPins => prevPins.map(pin => {
          const pinItems = items.filter(item => 
            item.location.building === pin.building
          );
          return {
            ...pin,
            items: pinItems
          };
        }));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []); // Run once when component mounts

  const handleMarkerClick = (pin) => {
    setSelectedPin(pin);
    setSelectedLocation({
      building: pin.building,
      coordinates: { lat: pin.lat, lng: pin.lng }
    });

    // Animate the marker
    if (markersRef.current[pin.id]) {
      markersRef.current[pin.id].setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => {
        markersRef.current[pin.id].setAnimation(null);
      }, 750);
    }
  };

  const onLoad = (map) => {
    mapRef.current = map;
    setIsMapLoaded(true);

    // Initialize marker clusterer
    const clusterer = new MarkerClusterer({
      map,
      markers: [],
      renderer: {
        render: ({ count, position }) => {
          return new window.google.maps.Marker({
            position,
            label: {
              text: String(count),
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#B3A369',
              fillOpacity: 0.8,
              strokeColor: '#003057',
              strokeWeight: 2,
              scale: 20
            }
          });
        }
      }
    });
    setMarkerClusterer(clusterer);
  };

  useEffect(() => {
    const createMarkers = async () => {
      if (isMapLoaded && mapRef.current && markerClusterer && window.google) {
        // Clear existing markers
        Object.values(markersRef.current).forEach(marker => marker.setMap(null));
        markersRef.current = {};
        markerClusterer.clearMarkers();

        const markerIcons = getMarkerIcons();
        if (!markerIcons) return;

        pins.forEach(pin => {
          const hasLostItems = pin.items.some(item => item.type === 'lost');
          const hasFoundItems = pin.items.some(item => item.type === 'found');
          
          let icon = markerIcons.default;
          if (hasLostItems && hasFoundItems) {
            icon = markerIcons.default;
          } else if (hasLostItems) {
            icon = markerIcons.lost;
          } else if (hasFoundItems) {
            icon = markerIcons.found;
          }

          const marker = new window.google.maps.Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map: mapRef.current,
            title: pin.building,
            icon: icon,
            animation: window.google.maps.Animation.DROP
          });

          marker.addListener('click', () => handleMarkerClick(pin));
          marker.addListener('mouseover', () => {
            marker.setIcon({
              ...icon,
              scale: 12
            });
          });
          marker.addListener('mouseout', () => {
            marker.setIcon(icon);
          });

          markersRef.current[pin.id] = marker;
          markerClusterer.addMarker(marker);
        });
      }
    };

    createMarkers();
  }, [isMapLoaded, pins, markerClusterer]);

  const handleLogout = () => {
    navigate('/login');
  };

  const filterPins = (filter) => {
    setActiveFilter(filter);
  };

  const handleReportSubmit = async (formData) => {
    try {
      const newItem = await createItem(formData);
      setPins(prevPins => prevPins.map(pin => {
        if (pin.building === formData.location.building) {
          return {
            ...pin,
            items: [...pin.items, newItem.data]
          };
        }
        return pin;
      }));

      setShowReportForm(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item. Please try again.');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="map-container">
      <div className="top-bar">
        <div className="filter-section">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => filterPins('all')}
          >
            All Items
          </button>
          <button 
            className={`filter-button ${activeFilter === 'lost' ? 'active' : ''}`}
            onClick={() => filterPins('lost')}
          >
            Lost Items
          </button>
          <button 
            className={`filter-button ${activeFilter === 'found' ? 'active' : ''}`}
            onClick={() => filterPins('found')}
          >
            Found Items
          </button>
        </div>
        <div className="action-buttons">
          <button className="messages-button" onClick={() => navigate('/messages')}>
            Messages
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="map-wrapper">
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
          <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={center} 
            zoom={15} 
            onLoad={onLoad}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true
            }}
          >
            {selectedPin && (
              <InfoWindow
                position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
                onCloseClick={() => setSelectedPin(null)}
              >
                <div className="info-window">
                  <h3>{selectedPin.building}</h3>
                  <button 
                    className="report-button"
                    onClick={() => {
                      setSelectedLocation({
                        building: selectedPin.building,
                        coordinates: { lat: selectedPin.lat, lng: selectedPin.lng }
                      });
                      setShowReportForm(true);
                    }}
                  >
                    Report Lost/Found Item
                  </button>
                  {selectedPin.items && selectedPin.items.length > 0 ? (
                    <div>
                      <h4>Items:</h4>
                      <ul className="items-list">
                        {selectedPin.items.map((item, index) => (
                          <li 
                            key={index}
                            className="item-entry"
                            onClick={() => handleItemClick(item)}
                          >
                            <span className={`item-type ${item.type}`}>
                              {item.type.toUpperCase()}
                            </span>
                            <span className="item-description">
                              {item.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No items reported at this location</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {showReportForm && (
        <ReportItemForm
          onSubmit={handleReportSubmit}
          onClose={() => {
            setShowReportForm(false);
            setSelectedLocation(null);
          }}
          selectedLocation={selectedLocation}
        />
      )}

      {selectedItem && (
        <ItemDetailOverlay
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Map;
