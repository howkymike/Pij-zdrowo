import { createContext, useState } from "react";

export const AuthContext = createContext({
  source: "",
  token: "",
  isAuthenticated: false,
  authenticate: (token) => {
    token;
  },
  logout: () => {},
  sourceHandler: (source) => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [source, setSource] = useState();

  function sourceHandler(source) {
    setSource(source);
  }

  function authenticate(token) {
    setAuthToken(token);
  }

  function logout(fnc) {
    setAuthToken(null, () => {
      fnc();
    });
  }

  const value = {
    source,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    sourceHandler,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
