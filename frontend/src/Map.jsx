import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import ReportItemForm from './components/ReportItemForm';
import ItemDetailOverlay from './components/ItemDetailOverlay';
import Chat from './components/Chat';
import FilterBar from './FilterBar';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerClusterer, setMarkerClusterer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const navigate = useNavigate();

  const containerStyle = {
    width: '100%',
    height: '100vh', // full screen height now
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
      { id: 1, lat: 33.7724, lng: -84.3929, building: 'Bobby Dodd Stadium', items: [] },
      { id: 2, lat: 33.7746, lng: -84.3985, building: 'Student Center', items: [] },
      { id: 3, lat: 33.7749, lng: -84.3964, building: 'CULC', items: [] },
      { id: 4, lat: 33.7772, lng: -84.3963, building: 'Klaus', items: [] },
      { id: 5, lat: 33.7754, lng: -84.4014, building: 'Instructional Center', items: [] },
      { id: 6, lat: 33.7757, lng: -84.4033, building: 'CRC', items: [] },
      { id: 7, lat: 33.7712, lng: -84.3914, building: 'North Ave Apartments', items: [] },
      { id: 8, lat: 33.7721, lng: -84.3947, building: 'Tech Tower', items: [] },
      { id: 9, lat: 33.7744, lng: -84.3957, building: 'Price Gilbert Library', items: [] },
      { id: 10, lat: 33.7736, lng: -84.3957, building: 'Skiles', items: [] },
      { id: 11, lat: 33.7761, lng: -84.3973, building: 'Van Leer', items: [] },
      { id: 12, lat: 33.7773, lng: -84.3978, building: 'College of Computing', items: [] },
      { id: 13, lat: 33.7764, lng: -84.4000, building: 'MRDC', items: [] },
      { id: 14, lat: 33.7741, lng: -84.3989, building: 'Student Center Parking', items: [] },
      { id: 15, lat: 33.7786, lng: -84.4043, building: 'West Campus Housing', items: [] },
      { id: 16, lat: 33.7731, lng: -84.3919, building: 'East Campus Housing', items: [] },
      { id: 17, lat: 33.7757, lng: -84.4033, building: 'Campus Recreation Center', items: [] },
      { id: 18, lat: 33.7746, lng: -84.3985, building: 'Student Center Food Court', items: [] },
      { id: 19, lat: 33.7764, lng: -84.3892, building: 'Tech Square', items: [] },
      { id: 20, lat: 33.7787, lng: -84.3877, building: 'Midtown', items: [] }
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

  const filterPins = (filter) => {
    if (filter.filter === 'search') {
      setSearchQuery(filter.value.toLowerCase());
    } else if (filter.filter === 'status') {
      setActiveFilter(filter.value);
    }
  };

  const getFilteredPins = () => {
    return pins.map(pin => {
      const filteredItems = pin.items.filter(item => {
        const matchesStatus = activeFilter === 'all' || item.type === activeFilter;
        const matchesSearch = !searchQuery || 
          item.description.toLowerCase().includes(searchQuery);
        return matchesStatus && matchesSearch;
      });
      return {
        ...pin,
        items: filteredItems
      };
    });
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

        const filteredPins = getFilteredPins();
        filteredPins.forEach(pin => {
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
  }, [isMapLoaded, pins, markerClusterer, activeFilter, searchQuery]);

  const handleLogout = () => {
    navigate('/login');
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
    <div className="map-fullscreen">
      
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
          <div className="top-bar">
            <div className='title-and-logo'>
            <img 
              src="\src\assets\bee.png" 
              alt="App Icon" 
              className="app-icon" 
              style={{ width: '50px', height: '50px', marginRight: '0px' }} 
            />
            <p className="title">GT Lost & Found</p>
            </div>
            <div className="search-and-filters">
              <FilterBar onFilterChange={filterPins} />
            </div>
            <div className="action-buttons">
              <button className="messages-button" onClick={() => setShowChat(true)}>
                Messages
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>







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

      {showChat && (
        <Chat onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default Map;
