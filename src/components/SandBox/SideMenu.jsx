import React, { useState, useEffect } from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios'
import style from './SideMenu.module.css'
import { connect } from 'react-redux';

import { Menu, Layout } from 'antd';
import {
  UserOutlined,AliwangwangOutlined,ContactsOutlined,DeploymentUnitOutlined,
  ExceptionOutlined,LaptopOutlined
} from '@ant-design/icons';
const { Sider } = Layout;

//渲染对应图标
const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <AliwangwangOutlined />,
  '/right-manage': <ContactsOutlined />,
  '/news-manage': <DeploymentUnitOutlined />,
  '/audit-manage': <ExceptionOutlined />,
  '/publish-manage': <LaptopOutlined />
}


function SideMenu(props) {
  const currentUserData=JSON.parse(window.localStorage.getItem('token'))
  //显示导航栏
  const isShow=item=>{
    return item.pagepermission===1 && currentUserData.role.rights.indexOf(item.key)!==-1
  }
  //列表状态
  const [menuList, setMenuList] = useState([])
  //渲染侧边导航
  const renderMenu = list => {
    return list.map(item => {
      if (item.children?.length>0 && isShow(item)) {
        return (
          <Menu.SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        )
      }
      return isShow(item) &&
        <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => navigate(item.key)}>
          {item.title}
        </Menu.Item>
    })
  }

  const navigate = useNavigate()

  //列表默认选中
  const {pathname}=useLocation()
  const mainPath=['/'+pathname.split('/')[1]]


  //获取数据
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      console.log(res.data);
      setMenuList(res.data)
    })
  }, [])

  return (
    <Sider trigger={null} collapsible className={style.overflow} collapsed={props.collapsed}>
      <div className={style.logo}>新闻创作系统</div>
      <Menu theme="dark" mode="inline" selectedKeys={pathname} defaultOpenKeys={mainPath}>
        {renderMenu(menuList)}
      </Menu>
    </Sider>
  )
}

export default connect(state=>({
  collapsed:state.collapsed
}))(SideMenu)