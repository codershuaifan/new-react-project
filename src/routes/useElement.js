import React from 'react'
import { Navigate } from 'react-router-dom'

import Login from '../pages/Login'
import NewsSandBox from '../pages/NewsSandBox'
import Home from '../pages/SandBox/Home'
import UserManage from '../pages/SandBox/UserManage'
import RoleList from '../pages/SandBox/RightManage/RoleList'
import RightList from '../pages/SandBox/RightManage/RightList'
import NoPermission from '../components/NoPermission'
import NewsAdd from '../pages/news-manage/NewsAdd'
import NewsDraft from '../pages/news-manage/NewsDraft'
import NewsCategory from '../pages/news-manage/NewsCategory'
import Audit from '../pages/audit-manage/Audit'
import AuditList from '../pages/audit-manage/AuditList'
import UnPublished from '../pages/publish-manage/UnPublished'
import Published from '../pages/publish-manage/Published'
import SunSet from '../pages/publish-manage/SunSet'
import NewsPreview from '../pages/news-manage/NewsPreview'
import NewsUpdate from '../pages/news-manage/NewsUpdate'
import News from '../pages/news'
import Detail from '../pages/detail'
//导航守卫
const isLogin = () => {
  return window.localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to='/login' />
}

console.log(window.localStorage.getItem('token'));
export default function useElement() {
  const router = [
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/news',
      element: <News />
    },
    {
      path: '/detail/:id',
      element: <Detail />
    },
    {
      path: '/',
      // element: <NewsSandBox />,
      element: isLogin(),
      children: [
        {
          path: '/',
          element: <Navigate to='home' />
        },
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'user-manage/list',
          element: <UserManage />
        },
        {
          path: 'right-manage/role/list',
          element: <RoleList />
        },
        {
          path: 'right-manage/right/list',
          element: <RightList />
        },
        {
          path: '/news-manage/add',
          element: <NewsAdd />
        },
        {
          path: '/news-manage/draft',
          element: <NewsDraft />
        },
        {
          path: '/news-manage/category',
          element: <NewsCategory />
        },
        {
          path: '/news-manage/preview/:id',
          element: <NewsPreview />
        },
        {
          path: '/news-manage/update/:id',
          element: <NewsUpdate />
        },
        {
          path: '/audit-manage/audit',
          element: <Audit />
        },
        {
          path: '/audit-manage/list',
          element: <AuditList />
        },
        {
          path: '/publish-manage/unpublished',
          element: <UnPublished />
        },
        {
          path: '/publish-manage/published',
          element: <Published />
        },
        {
          path: '/publish-manage/sunset',
          element: <SunSet />
        },
        {
          path: '*',
          element: <NoPermission />
        }
      ]
    },
  ]
  return router
}