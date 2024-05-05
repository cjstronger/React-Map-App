import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedAuth({ children }) {
  const { userAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!userAuth) navigate("/");
    },
    [userAuth, navigate]
  );
  return userAuth ? children : null;
}
export default ProtectedAuth;
