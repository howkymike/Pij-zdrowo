import { useEffect, useContext } from "react";
import { View } from "react-native";

import { AuthContext } from "../store/auth-context";

export default async function Logout({ navigation }) {
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    authCtx.logout(navigation);
  });

  return <View></View>;
}
