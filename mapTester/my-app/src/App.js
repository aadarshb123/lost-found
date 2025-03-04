import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Your Google Maps API key
const googleMapsApiKey = 'AIzaSyDrl5HtC_bvZ1Df3Tb5lCrhS6-DHE5PbR4';

const App = () => {
  const [pins, setPins] = useState([]); // To store pin positions and descriptions
  const [selectedPin, setSelectedPin] = useState(null); // To store selected pin for InfoWindow
  const mapRef = useRef(null); // Ref to store the map instance

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 33.776, // Default latitude (San Francisco)
    lng: -84.399,
  };

  // Pre-rendered pins
  useEffect(() => {
    const initialPins = [
      { lat: 33.772509, lng: -84.392861, building: 'Bobby Dodd', items: []},
      { lat: 33.773971, lng: -84.398806, building: 'Student Center', items: [] },
    ];
    setPins(initialPins);
  }, []);

  const handleMarkerClick = (pin) => {
    // Set the selected pin for the InfoWindow
    setSelectedPin(pin);
  };

  const handleCloseInfoWindow = () => {
    setSelectedPin(null); // Close the InfoWindow
  };

  const addToPin = (buildingPin) => {
    const lostItem = { "Item Description": "", "Date Found": "", "Other": "" };
    
    const enteredItem = prompt("In 1-2 words describe the item.");
    if (enteredItem) {
      lostItem["Item Description"] = enteredItem;
    }
  
    const enteredDate = prompt("Put the date");
    if (enteredDate) {
      lostItem["Date Found"] = enteredDate;
    }
  
    const enteredOther = prompt("Any other info");
    if (enteredOther) {
      lostItem["Other"] = enteredOther;
    }
  
    // Update the pins state immutably
    setPins(prevPins =>
      prevPins.map(pin =>
        pin === buildingPin
          ? { ...pin, items: [...pin.items, lostItem] }  // Add the new lost item
          : pin  // Keep other pins unchanged
      )
    );
  };

  const resolveItem = (buildingPin, itemIndex) => {
    // Update the items list by removing the resolved item
    setPins(prevPins =>
      prevPins.map(pin =>
        pin === buildingPin
          ? {
              ...pin,
              items: pin.items.filter((_, index) => index !== itemIndex), // Remove the resolved item
            }
          : pin
      )
    );
  };

  // Initialize the MarkerClusterer when the map is loaded
  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (mapRef.current && pins.length > 0) {
      const markers = pins.map((pin, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: mapRef.current,
        });

        marker.addListener('click', () => handleMarkerClick(pin));

        return marker;
      });

      new MarkerClusterer({ map: mapRef.current, markers });
    }
  }, [pins]);

  return (
    <div className="App">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad} // Initialize the map
        >
          {/* Render markers for each pin */}
          {pins.map((pin, index) => (
            <Marker
              key={index}
              position={{ lat: pin.lat, lng: pin.lng }}
              onClick={() => handleMarkerClick(pin)} // Set the clicked pin
            >
              {selectedPin === pin && (
                <InfoWindow onCloseClick={handleCloseInfoWindow}>
                  <div>
                    <h3>Building</h3>
                    <p>{pin.building}</p>
                    {/* Display the lost items */}
                    <h3>All Lost Items:</h3>
                    <ul>
                      {pin.items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item["Item Description"]}</strong><br />
                          Date Found: {item["Date Found"]}<br />
                          {item["Other"] && <em>Other Info: {item["Other"]}</em>}
                          <br />
                          <button onClick={() => resolveItem(pin, idx)}>Resolve</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => addToPin(pin)}>Add Item</button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
      <h1>List of Items</h1>
      <ul>
        {pins.map((pin, pinIndex) => (
          pin.items.map((item, idx) => (
            <li key={`${pinIndex}-${idx}`}>
              <strong>{item["Item Description"]}</strong><br />
              Date Found: {item["Date Found"]}<br />
              {item["Other"] && <em>Other Info: {item["Other"]}</em>}
              <br />
              <button onClick={() => resolveItem(pin, idx)}>Resolve</button>
            </li>
          ))
        ))}
      </ul>
    </div>
  );
};

export default App;
