import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Marker, Circle } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import ReportItemForm from './components/ReportItemForm';
import ItemDetailOverlay from './components/ItemDetailOverlay';
import Chat from './components/Chat';
import FilterBar from './FilterBar';
import { createItem, getItems } from './utils/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { findNearbyItems } from './utils/locationUtils';
import './Map.css';

const googleMapsApiKey = 'AIzaSyDrl5HtC_bvZ1Df3Tb5lCrhS6-DHE5PbR4';

// Define libraries outside the component to prevent recreation on each render
const libraries = ['marker', 'visualization'];

const METERS_PER_MILE = 1609.34;

const RADIUS_PRESETS = [
  { label: '0.1 mi', value: 0.1 },
  { label: '0.25 mi', value: 0.25 },
  { label: '0.5 mi', value: 0.5 },
  { label: '1 mi', value: 1.0 }
];

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
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [showNearbyPanel, setShowNearbyPanel] = useState(false);
  const [proximityRadius, setProximityRadius] = useState(0.5); // Default to 0.5 miles
  const [showMyItems, setShowMyItems] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [isLoadingUserItems, setIsLoadingUserItems] = useState(false);

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
    localStorage.removeItem('userId');
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

  // Request location permission and start tracking
  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setShowLocationPrompt(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Some features may be limited.');
          setShowLocationPrompt(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setShowLocationPrompt(false);
    }
  };

  // Convert miles to meters for the backend/calculations
  const getRadiusInMeters = (miles) => {
    return Math.min(miles * METERS_PER_MILE, METERS_PER_MILE); // Cap at 1 mile
  };

  const handleRadiusChange = (newRadius) => {
    // Ensure radius is between 0 and 1 mile
    const radius = Math.min(Math.max(0, newRadius), 1.0);
    setProximityRadius(radius);
  };

  // Format distance for display
  const formatDistance = (meters) => {
    const miles = meters / METERS_PER_MILE;
    if (miles < 0.1) {
      return `${(miles * 5280).toFixed(0)} ft`; // Convert to feet if less than 0.1 miles
    }
    return `${miles.toFixed(2)} mi`;
  };

  // Check for nearby items whenever user location, pins, or radius changes
  useEffect(() => {
    if (userLocation && pins.length > 0) {
      const allItems = pins.flatMap(pin => pin.items);
      const nearby = findNearbyItems(userLocation, allItems, getRadiusInMeters(proximityRadius));
      setNearbyItems(nearby);
      
      if (nearby.length > 0) {
        setShowNearbyPanel(true);
      }
    }
  }, [userLocation, pins, proximityRadius]);

  // Add function to fetch user's items
  const fetchUserItems = async () => {
    setIsLoadingUserItems(true);
    try {
      const response = await getItems(); // Using getItems instead of getUserItems
      // Filter items to only show user's items
      const userItemsOnly = response.items.filter(
        item => item.userId === localStorage.getItem('userId')
      );
      setUserItems(userItemsOnly);
    } catch (error) {
      console.error('Error fetching user items:', error);
      alert('Failed to load your items. Please try again.');
    } finally {
      setIsLoadingUserItems(false);
    }
  };

  // Add function to handle resolving items
  const handleResolveItem = async (itemId) => {
    try {
      await fetch(`http://localhost:5001/api/items/deleteItem/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      
      // Remove the item from userItems
      setUserItems(prevItems => 
        prevItems.filter(item => item._id !== itemId)
      );

      // Remove the item from pins
      setPins(prevPins => 
        prevPins.map(pin => ({
          ...pin,
          items: pin.items.filter(item => item._id !== itemId)
        }))
      );

      alert('Item has been resolved and removed');
    } catch (error) {
      console.error('Error resolving item:', error);
      alert('Failed to resolve item. Please try again.');
    }
  };

  return (

    <div className="map-fullscreen">
      



      <div className="map-wrapper">
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
          <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={userLocation || center} 
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
        <div className={`report-form-overlay ${showReportForm ? "show" : ""}`}>
          <ReportItemForm
            onSubmit={handleReportSubmit}
            onClose={() => {
              setShowReportForm(false);
              setSelectedLocation(null);
            }}
            selectedLocation={selectedLocation}
          />
        </div>
      )}

      {selectedItem && (
        <ItemDetailOverlay
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showChat && (
        <div className={`chat-overlay ${showChat ? "show" : ""}`}>
          <div className="chat-content">
            <Chat onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
