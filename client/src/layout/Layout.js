import React from 'react';
import Navbar from '../components/navbar';

function Layout(props) {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
}

export default Layout;
