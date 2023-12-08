import React from 'react'
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: '#fff',
      }}
    >
      <Outlet/>
    </Content>
  );
}

export default Home