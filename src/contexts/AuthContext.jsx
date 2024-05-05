import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  userAuth: false,
  user: {
    name: "",
    password: "",
    email: "",
    avatar: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, userAuth: true };
    case "logout":
      return { ...state, user: "", userAuth: false };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ userAuth, user }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (password === FAKE_USER.password && email === FAKE_USER.email)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ login, logout, userAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
export { useAuth, AuthProvider };
