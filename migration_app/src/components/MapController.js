import React, { Component } from "react";
import Map from "./Map";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Divider, Modal, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { withSnackbar } from "notistack";

class MapController extends Component {
  state = {
    animalType: "",
    isOpenCreateMigrationModal: false,
    isOpenEditMigrationModal: false,
    isChangedInfoWindow: false,
    showingInfoWindow: false,
    migrations: [],
    newMigrationId: 0,
  };

  submitCreateModal = () => {
    // Creates new migration
    if (
      isNaN(this.state.latitude) ||
      isNaN(this.state.longitude) ||
      this.state.description === "" ||
      this.state.animalType === ""
    ) {
      Swal.fire({
        // Alert gets triggered when something missing in the form
        title: "Error!",
        icon: "error",
        text: "Some fields are missing in the form!",
      });
      return;
    }
    const newMigration = {
      // creating formdata that we need to send in the api call
      migrationId: this.state.newMigrationId,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      description: this.state.description,
      animalType: this.state.animalType,
      created_at: new Date(),
    };

    this.setState({
      newMigrationId: this.state.newMigrationId + 1,
      migrations: [...this.state.migrations, newMigration],
      latitude: "",
      longitude: "",
      description: "",
      animalType: "",
      isOpenCreateMigrationModal: false,
    });
    this.props.enqueueSnackbar("Successfully added new migration.", {
      variant: "success",
    });
    // axios({
    //   url: "http://localhost:8080/api/v1/migrations",
    //   method: "POST",
    //   headers: {},
    //   data: formData,
    // })
    //   .then((res) => {
    //     this.setState({ isOpenCreateMigrationModal: false });       // closing create migration modal after creation of a new migration
    // this.props.enqueueSnackbar("Successfully added new migration.", {
    //   variant: "success",
    // });
    //     this.fetchMigrations();
    //   })

    //   .catch((err) => {
    //     this.props.enqueueSnackbar("Failed to add new migration", {
    //       variant: "error",
    //     });
    //   });
  };

  submitEditModal = () => {
    // Updates existing Migration
    if (
      isNaN(this.state.latitude) ||
      isNaN(this.state.longitude) ||
      this.state.description === ""
    ) {
      Swal.fire({
        // Alert gets triggered when something missing in the form
        title: "Error!",
        icon: "error",
        text: "Some fields are missing in the form!",
      });
      return;
    }
    const formData = {
      latitude:
        this.state.latitude === ""
          ? this.state.selectedAnimal.latitude
          : this.state.latitude,
      longitude:
        this.state.longitude === ""
          ? this.state.selectedAnimal.longitude
          : this.state.longitude,
      description: this.state.description,
    };
    const { migrations } = this.state;
    const newMigrations = migrations.map((migration) =>
      migration.migrationId == this.state.selectedAnimal.migrationId
        ? formData
        : migration
    );
    this.setState({
      migrations: newMigrations,
      isOpenEditMigrationModal: false, // closing Edit Migration Modal after successful migration of animal
      showingInfoWindow: false,
      isChangedInfoWindow: true,
    });
    this.props.enqueueSnackbar("Migration updated.", {
      variant: "success",
    });

    // axios({
    //   url: `http://localhost:8080/api/v1/migrations/${this.state.selectedAnimal.migrationId}`,
    //   method: "PUT",
    //   headers: {},
    //   data: formData,
    // })
    //   .then((res) => {
    //     this.setState({
    //       isOpenEditMigrationModal: false, // closing Edit Migration Modal after successful migration of animal
    //       showingInfoWindow: false,
    //       isChangedInfoWindow: true,
    //     });
    //     this.props.enqueueSnackbar("Migration updated.", {
    //       variant: "success",
    //     });
    //     this.fetchMigrations();
    //   })

    //   .catch((err) => {
    //     this.props.enqueueSnackbar("Failed to update migration", {
    //       variant: "error",
    //     });
    //   });
  };

  DeleteMigration = () => {
    // deletes existing migration
    const { migrations } = this.state;
    const newMigrations = migrations.filter(
      (migration) =>
        migration.migrationId != this.state.selectedAnimal.migrationId
    );
    this.setState({
      migrations: newMigrations,
      isOpenEditMigrationModal: false,
      showingInfoWindow: false,
      isChangedInfoWindow: true,
    });
    this.props.enqueueSnackbar("Successfully deleted migration.", {
      variant: "success",
    });

    // axios({
    //   url: `http://localhost:8080/api/v1/migrations/${this.state.selectedAnimal.migrationId}`,
    //   method: "DELETE",
    //   headers: {},
    // })
    //   .then((res) => {
    //     this.setState({
    //       isOpenEditMigrationModal: false,
    //       showingInfoWindow: false,
    //       isChangedInfoWindow: true,
    //     });
    //     this.props.enqueueSnackbar("Successfully deleted migration.", {
    //       variant: "success",
    //     });
    //     this.fetchMigrations();
    //   })
    //   .catch((err) => {
    //     this.props.enqueueSnackbar("Failed to delete migration.", {
    //       variant: "error",
    //     });
    //   });
  };

  fetchMigrations = () => {
    // fetches all the existing migrations
    axios({
      url: "http://localhost:8080/api/v1/migrations",
      method: "GET",
      headers: {},
    })
      .then((res) => {
        this.setState({ migrations: res.data.data });
      })

      .catch((err) => {});
  };

  handleAnimalSelection = (migration) => {
    // gets called we select an animal from the map
    this.setState({
      selectedAnimal: migration,
      latitude: migration !== undefined ? migration.latitude : "", // checks if something was updated in the form to update Migration
      longitude: migration !== undefined ? migration.longitude : "",
      description: migration !== undefined ? migration.description : "",
    });
  };

  handleSelectAnimalType = (e) => {
    // to select animal type in the Create migration modal
    this.setState({ animalType: e.target.value });
  };

  componentDidMount() {
    this.fetchMigrations();
  }

  editMigrationModel = () => {
    // Modal for updating/editing a migration
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          color: "white",
        }}
        open={this.state.isOpenEditMigrationModal} // opens Modal if this.state.isOpenEditMigrationModal is true
        onClose={() => this.setState({ isOpenEditMigrationModal: false })} // closes the modal when we click outside the Modal
        BackdropProps={{
          timeout: 500,
          background: "white",
        }}
      >
        <div
          className="row"
          style={{
            background: "white",
            minHeight: "300px",
            width: "550px",
            padding: "10px",
          }}
        >
          <div>
            <Typography
              style={{
                fontSize: "20px",
                padding: 4,
                color: "black",
                textAlign: "center",
                marginTop: 5,
              }}
            >
              Edit Migration
            </Typography>
            <Divider
              style={{
                marginTop: 5,
                backgroundColor: "#2aa65a",
              }}
            />
          </div>
          <Typography
            style={{
              color: "black",
              marginTop: 10,
              padding: "4px",
              marginLeft: "10px",
            }}
          >
            Enter New Latitude and Longitude to Migrate selected Animal
          </Typography>
          <div style={{ marginLeft: "5%", marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Latitude"
              variant="outlined"
              style={{ marginRight: "5%" }}
              onChange={(e) => this.setState({ latitude: e.target.value })}
              value={this.state.latitude}
            />
            <TextField
              id="outlined-basic"
              label="Longitude"
              variant="outlined"
              onChange={(e) => this.setState({ longitude: e.target.value })}
              value={this.state.longitude}
            />
            {((this.state.latitude !== undefined &&
              isNaN(this.state.latitude)) ||
              (this.state.latitude !== undefined &&
                isNaN(this.state.longitude))) && (
              <div>
                <label style={{ color: "red" }}>
                  Please Enter Valid Latitude and Longitude!
                </label>
              </div>
            )}
          </div>
          <div
            className="textfield"
            maxRows={2}
            style={{ marginLeft: "5%", marginTop: "2%" }}
          >
            <TextField
              placeholder="Enter Description"
              multiline
              maxRows={2}
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="error"
              onClick={() => this.DeleteMigration()}
              style={{ marginLeft: 20, marginTop: 30 }}
            >
              Delete Migration
            </Button>

            <Button
              variant="contained"
              style={{ float: "right", marginRight: "20px", marginTop: 30 }}
              onClick={() => this.submitEditModal()}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  createMigrationModal = () => {
    // Modal for updating/editing a migration
    const { isOpenCreateMigrationModal } = this.state; // destructuring
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          color: "white",
        }}
        open={isOpenCreateMigrationModal}
        onClose={() => this.setState({ isOpenCreateMigrationModal: false })}
        BackdropProps={{
          timeout: 500,
          background: "white",
        }}
      >
        <div
          className="row"
          style={{
            background: "white",
            minHeight: 305,
            width: 550,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <div>
            <Typography
              style={{
                fontSize: "20px",
                padding: "4px",
                color: "black",
                textAlign: "center",
              }}
            >
              Enter new Migration
            </Typography>
            <Divider
              style={{
                marginTop: 4,
                backgroundColor: "#2aa65a",
              }}
            />
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              style={{ marginLeft: "5%", marginTop: 15, width: "35%" }}
            >
              <InputLabel id="demo-simple-select-label">
                Select Animal
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.animal}
                onChange={(e) => this.handleSelectAnimalType(e)}
              >
                <MenuItem value={"Rabbit"}>Rabbit</MenuItem>
                <MenuItem value={"Bird"}>Bird</MenuItem>
                <MenuItem value={"Bear"}>Bear</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ marginLeft: "5%", marginTop: 5 }}>
            <TextField
              id="outlined-basic"
              label="Latitude"
              variant="outlined"
              style={{ marginRight: "5%" }}
              value={this.state.latitude}
              onChange={(e) => this.setState({ latitude: e.target.value })}
            />
            <TextField
              id="outlined-basic"
              label="Longitude"
              variant="outlined"
              value={this.state.longitude}
              onChange={(e) => this.setState({ longitude: e.target.value })}
            />
          </div>
          {((this.state.latitude !== undefined && isNaN(this.state.latitude)) ||
            (this.state.latitude !== undefined &&
              isNaN(this.state.longitude))) && (
            <div>
              <label style={{ color: "red", marginLeft: "5%" }}>
                Please Enter Valid Latitude and Logitude!
              </label>
            </div>
          )}
          <div
            className="textfield"
            maxRows={2}
            style={{ marginLeft: "5%", marginTop: "2%" }}
          >
            <TextField
              placeholder="Enter Description"
              multiline
              maxRows={2}
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              style={{
                marginRight: 15,
                marginTop: 15,
              }}
              onClick={() => this.submitCreateModal()}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <div style={{ width: "83%", margin: "0 auto" }}>
        {this.createMigrationModal()}
        {this.editMigrationModel()}
        <div
          style={{
            width: "100%",
            textAlign: "right",
            marginRight: "20px",
            marginTop: "20px",
          }}
        >
          {!!this.state.selectedAnimal && ( //Renders edit button if an animal is selected
            <Button
              variant="contained"
              onClick={() => this.setState({ isOpenEditMigrationModal: true })}
              style={{ marginRight: "74.5%" }}
            >
              Edit Migration
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => this.setState({ isOpenCreateMigrationModal: true })}
          >
            New Migration
          </Button>
        </div>
        <div className="map">
          <Map
            migrations={this.state.migrations} // passing all the migrations to Map.js
            cancelAnimalSelection={() => this.handleAnimalSelection()} // to update state when we unselect a migration
            handleAnimalSelection={(
              migration // updates state when a migration is selected to open or edit Migration
            ) => this.handleAnimalSelection(migration)}
            showingInfoWindow={this.state.showingInfoWindow} // passing down infowindow prop if it should be displayed
            handleShowInfoWindow={(
              showingInfoWindow // to close infowindow when a selected migration is selected or deleted
            ) => this.setState({ showingInfoWindow })}
            isChangedInfoWindow={this.state.isChangedInfoWindow} // tells Map.js to close infowindow when a migration is edited or deleted
            handleIsChangedInfoWindow={(
              isChangedInfoWindow // tells mapcontroller if any migration is selected in Map.js
            ) => this.setState({ isChangedInfoWindow })}
          />
        </div>
      </div>
    );
  }
}

export default withSnackbar(MapController);
