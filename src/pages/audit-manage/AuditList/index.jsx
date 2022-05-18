import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, notification } from 'antd';
import {
   ZoomInOutlined
} from '@ant-design/icons';
import axios from 'axios'

const auditList = ['未审核', '审核中', '已通过', '未通过']
const publishList = ['未发布', '待发布', '已上线', '已下线']
const colorList = ['black', 'orange', 'green', 'red']

export default function AuditList() {
  const navigate = useNavigate()
  //审核列表状态
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: auditState => <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
    },
    {
      title: '操作',
      render: (value) => {
        return (
          <div>
            {
              value.auditState === 1 && <Button size='large' type="danger" onClick={() => backNews(value)}>撤销</Button>
            }
            {
              value.auditState === 2 && <Button size='large' type="primary" onClick={()=>publishNews(value)}>发布</Button>
            }
            {
              value.auditState === 3 && <Button size='large' onClick={()=>updateNews(value)}>修改</Button>
            }
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
    axios.get(`/news?author=${currentUserDATA.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])
  //跳转预览路由
  const jumpPreview = value => {
    navigate(`/news-manage/preview/${value.id}`)
  }
  //撤销按钮
  const backNews = value => {
    setDataSource(dataSource.filter(item => item.id !== value.id))
    axios.patch(`news/${value.id}`, { auditState: 0 }).then(res => {
      navigate('/news-manage/draft')
      notification.open({
        message: '通知',
        description: `您可以到草稿箱中查看`,
        placement: 'bottomRight'
      });
    })
  }
  //修改按钮
  const updateNews=value=>{
    navigate(`/news-manage/update/${value.id}`)
  }
  //发布按钮
  const publishNews=value=>{
    axios.patch(`news/${value.id}`, { publishState: 2,publishTime:Date.now() }).then(res => {
      navigate('/publish-manage/published')
      notification.open({
        message: '通知',
        description: `您可以到[发布管理/已发布]中查看`,
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
