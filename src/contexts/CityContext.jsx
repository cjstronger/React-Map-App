import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();
const intitialState = {
  cities: [],
  isLoading: false,
  getCities: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/got":
      return { ...state, isLoading: false, getCities: action.payload };
    case "city/added":
      return {
        ...state,
        isLoading: false,
        getCities: action.payload,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
        getCities: {},
      };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ isLoading, cities, getCities, error }, dispatch] = useReducer(
    reducer,
    intitialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [getCities, setGetCities] = useState({});
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch("http://localhost:8000/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data!",
        });
      }
    }
    fetchCities();
  }, []);
  async function getCity(id) {
    if (Number(id) === getCities.id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/got", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "There was an getting the city!" });
    }
  }

  async function postCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:8000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city!",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting that city!",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        isLoading,
        cities,
        getCities,
        getCity,
        postCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  return context;
}
export { CitiesProvider, useCities };
