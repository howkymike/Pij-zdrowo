import { createContext } from "react";

export const UrlContext = createContext({
  URL: "",
});

function URLContextProvider({ children }) {
  const value = {
    URL: "http://3.125.155.58",
  };
  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
}
export default URLContextProvider;
