- First all we have App.js components that is the root of the project. We have called Header.js and MapController.js in App.js.

- Header has the blue top bar in the app

- We have a map that is being rendered in the Map Component along with marker and Infowindow

- I have created a MapController that has all the logic of the app such as CRUD operations and where we store our data (state) which is then passed down to Map component which uses those props to display map and migrations on the map

- As MapController is the parents component of Map, so I used handler methods for all kind of communication from Map.js(child component) to MapController such as handleAnimalSelection() which stores the state of selected animal in MapController so we can keep the logic and view separate.

- I used class components because i feel class components are more readable, we can define methods above render method inside class component, and all the states are defined at one place and multiple states can be updated by calling one single method this.setState({}) and all the states can be updated inside one parenthesis at once.

- I also used NotiStack Snackbars because they are very easy to use and they are quick and has a very good user interface
