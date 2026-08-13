"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import AuthProvider from "./authprovider";
import NotificationListener from "@/components/NotificationListener";

export default function Providers({ children, userData }) {
  return (
    <Provider store={store}>
      <AuthProvider userData={userData}>
        <NotificationListener />

        {children}
      </AuthProvider>
    </Provider>
  );
}