import { createContext, useState } from "react";

export const AuthContext = createContext({
  source: "",
  token: "",
  URL: "",
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
    setSource("bacdc5b24e484bc49c26db97d039e1d1");
  }

  function authenticate(token) {
    setAuthToken(token);
  }

  function logout(navigation) {
    setAuthToken(null);
    // navigation.navigate("Zaloguj się");
  }

  const value = {
    source,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    sourceHandler,
    URL: "http://3.125.155.58",
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
