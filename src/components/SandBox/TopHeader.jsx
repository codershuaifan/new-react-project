import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import style from './TopHeader.module.css'
import { connect } from 'react-redux';

import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
const { Header } = Layout;

function TopHeader(props) {
  const {collapsed,fold}=props
  //当前登录用户数据
  const currentUserDATA=JSON.parse(window.localStorage.getItem('token'))
  //改变收起状态
  const toggle = () => {
    fold()
  }
  //点击退出按钮
  const loginOut = () => {
    window.localStorage.removeItem('token')
    navigate('/login', {
      replace: true
    })
  }
  //用户下拉菜单选项
  const menu = (
    <Menu items={[
      {
        label: currentUserDATA.role.roleName
      },
      {
        danger: true,
        label: <div onClick={loginOut}>退出</div>,
      },
    ]} />
  );
  const navigate = useNavigate()
  return (
    <Header className="site-layout-background" style={{ padding: '0px 16px' }}>
      {/* 控制触发器图标 */}
      {collapsed ? <MenuUnfoldOutlined className='trigger' onClick={toggle} /> :
        <MenuFoldOutlined className='trigger' onClick={toggle} />}
      {/* 用户下拉菜单 */}
      <Dropdown overlay={menu} className={style.location} placement="bottomRight">
        <Space>
          欢迎<span className={style.name}>{currentUserDATA.username}</span>回来
          <Avatar icon={<UserOutlined />}  size={50}/>
        </Space>
      </Dropdown>
    </Header>
  )
}

export default connect(
  state=>({
    collapsed:state.collapsed
  }),
  {
    fold:()=>({type:'change'})
  }
)(TopHeader)