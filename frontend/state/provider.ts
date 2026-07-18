"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return React.createElement(Provider, { store, children });
}
