import { useEffect, useContext } from "react";

import { AuthContext } from "../store/auth-context";

export default async function Logout({ navigation }) {
  useEffect(() => {
    const authCtx = useContext(AuthContext);
    authCtx.logout(() => {
      navigation.navigate("Login");
    });
  });

  return <></>;
}
