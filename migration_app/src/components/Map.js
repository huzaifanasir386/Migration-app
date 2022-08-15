import React, { Component } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import bear from "../Images/bear.png"
import bird from "../Images/bird.png"
import rabbit from "../Images/rabbit.png"

const mapStyles = {};

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
    selectedAnimal: {},
  };

  onMarkerClick = (migration, props, marker, e) => {
    // when a migrattion is selected by clicking on marker
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedAnimal: migration,
    });
    this.props.handleIsChangedInfoWindow(false);
    this.props.handleShowInfoWindow(true);
  };

  onClose = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
      this.props.cancelAnimalSelection();
    }
  };
  render() {
    mapStyles.height = "100%";
    mapStyles.width = "100%";
    mapStyles.marginTop = "20px";
    const migrations = this.props.migrations;
    this.props.isChangedInfoWindow === true && // props from Mapcontroller to close infowindow if a migration has been updated or deleted
      this.state.showingInfoWindow === true &&
      this.setState({ showingInfoWindow: this.props.showingInfoWindow });
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={3}
          style={mapStyles}
          initialCenter={{
            lat: 57.0894274,
            lng: 53.0664063,
          }}
        >
          {migrations.map((migration) => {
            return (
              <Marker
                key={migration.migrationId}
                onClick={(props, marker, e) => {
                  this.onMarkerClick(migration, props, marker, e);
                  this.props.handleAnimalSelection(migration);
                }}
                name={migration.map}
                position={{ lat: migration.latitude, lng: migration.longitude }}
                icon={{
                  url:
                    migration.animalType === "Rabbit"
                      ? rabbit
                      : migration.animalType === "Bear"
                      ? bear
                      : migration.animalType === "Bird"
                      ? bird
                      : rabbit,
                  scaledSize: new this.props.google.maps.Size(25, 35), // setting size of the icon of migration
                }}
              />
            );
          })}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4 style={{ marginTop: 5, marginBottom: 0 }}>
                Animal Type:
                <span style={{ fontWeight: 400, marginLeft: 5 }}>
                  {this.state.selectedAnimal.animalType}
                </span>
              </h4>
              <h4 style={{ marginTop: 5, marginBottom: 0 }}>
                Latitude:
                <span style={{ fontWeight: 400, marginLeft: 5 }}>
                  {this.state.selectedAnimal.latitude}
                </span>
              </h4>
              <h4 style={{ marginTop: 5, marginBottom: 0 }}>
                Longitude:
                <span style={{ fontWeight: 400, marginLeft: 5 }}>
                  {this.state.selectedAnimal.longitude}
                </span>
              </h4>
              <h4 style={{ marginTop: 5, marginBottom: 0 }}>
                Created at:
                <span style={{ fontWeight: 400, marginLeft: 5 }}>
                  {this.state.selectedAnimal.createdAt}
                </span>
              </h4>
              <h4 style={{ marginTop: 5, marginBottom: 0 }}>
                Updated at:
                <span style={{ fontWeight: 400, marginLeft: 5 }}>
                  {this.state.selectedAnimal.updatedAt}
                </span>
              </h4>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCP3zFD_8SzaiAfZtIPGy-UzSmkx_-_EMY",
})(MapContainer);
