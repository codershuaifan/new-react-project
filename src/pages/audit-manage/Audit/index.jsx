import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, notification } from 'antd';
import {
  ZoomInOutlined
} from '@ant-design/icons';
import axios from 'axios'

export default function Audit() {
  const navigate = useNavigate()
  //审核新闻状态
  const [dataSource, setDataSource] = useState([])
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))
  //控制列
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: title => <b>《{title}》</b>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category => <span>{category.title}</span>
    },
    {
      title: '操作',
      render: (value) => {
        return (
          <div>
            <Button type="primary" onClick={() => pass(value)}>通过</Button>
            <Button type="danger" onClick={() => NoPass(value)}>驳回</Button>
          </div>
        )
      }
    },
    {
      title: '预览新闻',
      render: (value) => {
        return (
          <div>
            <Button shape="round" size='large' type="primary" icon={<ZoomInOutlined />} onClick={() => jumpPreview(value)}>预览</Button>
          </div>
        )
      }
    }
  ];
  //获取数据
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      if(currentUserDATA.roleId===2){
        res.data=res.data.filter(item=>{
          return item.author===currentUserDATA.username || item.region===currentUserDATA.region && item.roleId===3
        })
      }
      setDataSource(res.data)
    })
  }, [])
  //跳转预览路由
  const jumpPreview = value => {
    navigate(`/news-manage/preview/${value.id}`)
  }
  //审核通过
  const pass = value => {
    axios.patch(`news/${value.id}`, { auditState: 2,publishState:1 }).then(res => {
      navigate('/audit-manage/list')
      notification.open({
        message: '通知',
        description: `您可以到审核列表中查看`,
        placement: 'bottomRight'
      });
    })
  }
  //审核驳回
  const NoPass=value=>{
    axios.patch(`news/${value.id}`, { auditState: 3 }).then(res => {
      navigate('/audit-manage/list')
      notification.open({
        message: '通知',
        description: `您可以到审核列表中查看`,
        placement: 'bottomRight'
      });
    })
  }
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 7 }} rowKey={item => item.id} />
    </div>
  )
}
