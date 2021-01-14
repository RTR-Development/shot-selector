import React from "react";

export default React.createContext({
  savedDrinks: [],
  setSavedDrinks: (drink) => {},
  savedWheel: [],
  setSavedWheel: (active) => {},
});
