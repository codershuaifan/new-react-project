import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Modal,notification } from 'antd';
import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined, ZoomInOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;

export default function NewsDraft() {
  const navigate = useNavigate()
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))
  //控制列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => {
        return <Tag color="magenta">{id}</Tag>
      }
    },
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
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => deleteCate(value)} />&nbsp;
            <Button shape="circle" icon={<EditOutlined />} onClick={() => jumpUpdate(value)} />&nbsp;
            <Button shape="circle" type="primary" icon={<VerticalAlignTopOutlined />} onClick={() => handleCheck(value)}></Button>
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
  //草稿箱状态
  const [dataSource, setDataSource] = useState([])
  //获取数据
  useEffect(() => {
    axios.get(`/news?author=${currentUserDATA.username}&auditState=0&_expand=category`).then(res => {
      console.log(res.data);
      setDataSource(res.data)
    })
  }, [])
  //删除按钮
  const deleteCate = (value) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        confirmDelete(value)
      },
    });
  }
  //执行删除操作
  const confirmDelete = (value) => {
    setDataSource(dataSource.filter(item => item.id !== value.id))
    axios.delete(`/news/${value.id}`)
  }
  //跳转预览路由
  const jumpPreview = value => {
    navigate(`/news-manage/preview/${value.id}`)
  }
  //跳转更新路由
  const jumpUpdate = value => {
    navigate(`/news-manage/update/${value.id}`)
  }
  //提交审核
  const handleCheck = value => {
    axios.patch(`news/${value.id}`, { auditState: 1 }).then(res => {
      navigate('/audit-manage/list')
      notification.open({
        message: '通知',
        description:`您可以到审核列表中查看`,
        placement:'bottomRight'
      });
    })
  }
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 7 }} rowKey={item => item.id} />
    </div>
  )
}
