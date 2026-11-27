"use client";

import React from "react";
import { BackdropSwitch } from "./backdrops/BackdropSwitch";

/**
 * Main Backdrop Root Component
 * Renders the active cinematic background direction via BackdropSwitch.
 * Fixed at z-index 0 with pointer-events-none.
 */
export function Backdrop() {
  return <BackdropSwitch />;
}
