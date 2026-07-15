"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";

export default function AuthProvider({ children, userData }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      dispatch(
        loginUser({
          userData,
        }),
      );
    }
  }, [userData, dispatch]);

  return children;
}
