import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './NewsSandBox.css'
import { Spin } from 'antd'
import { connect } from 'react-redux'

import TopHeader from '../components/SandBox/TopHeader'
import SideMenu from '../components/SandBox/SideMenu'

//antd组件
import { Layout } from 'antd';
const { Content } = Layout;

function NewsSandBox(props) {
  const spinning=props.spinning
  const [collapsed, setCollapsed] = useState(false)
  //改变触发器状态
  const toggle = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Layout>
      {/* 侧边导航 */}
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        {/* 头部 */}
        <TopHeader></TopHeader>
        {/* 内容区域 */}

        <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280, }}>
          <Spin size="large" spinning={spinning}>
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}

export default connect(
  state=>({
    spinning:state.spinning
  })
)(NewsSandBox)