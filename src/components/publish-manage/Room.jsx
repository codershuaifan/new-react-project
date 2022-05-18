import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'antd';
import {
   ZoomInOutlined
} from '@ant-design/icons';

export default function Room(props) {
  const {dataSource,render}=props
  const navigate = useNavigate()
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
      render: value => render(value)
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
  
  //跳转预览路由
  const jumpPreview = value => {
    navigate(`/news-manage/preview/${value.id}`)
  }
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 7 }} rowKey={item => item.id} />
    </div>
  )
}
