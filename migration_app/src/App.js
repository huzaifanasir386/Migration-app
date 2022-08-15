import React from "react";
import { SnackbarProvider } from "notistack";
import "./App.css";
import Header from "./components/Header";
import MapController from "./components/MapController";
function App() {
  return (
    <div>
      <SnackbarProvider maxSnack={3}>
        <Header />
        <MapController />
      </SnackbarProvider>
    </div>
  );
}

export default App;
