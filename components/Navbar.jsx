'use client';

import React from 'react';
import TrixNavbar from './trix/TrixNavbar';

export default function Navbar(props) {
  return <TrixNavbar isLightMode={false} {...props} />;
}
