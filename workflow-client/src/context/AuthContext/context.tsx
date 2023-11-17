import React, { useReducer, createContext, PropsWithChildren } from "react";

import authReducer from "./reducer";
import { AuthActionType, AuthState } from "./type";

const INITIAL_STATE: AuthState = {
  user: undefined,
  token: undefined,
};

export const AuthContext = createContext<[AuthState, React.Dispatch<AuthActionType>]>([
  INITIAL_STATE,
  () => null,
]);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};
