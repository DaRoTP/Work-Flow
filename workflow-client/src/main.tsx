import React from "react";

import router from "@/router";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AlertProvider } from "@/context/AlertContext";
import { ModalProvider } from "@/context/ModalContext";
import { UserProvider } from "@/context/UserContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <ModalProvider>
      <UserProvider>
        <AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider>
      </UserProvider>
    </ModalProvider>
  // </React.StrictMode>
);
