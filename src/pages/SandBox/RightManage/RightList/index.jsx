import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Button, Tag, Modal, Popover, Switch } from 'antd';
const { confirm } = Modal;

export default function RightList() {
  //气泡卡片内容
  const content = value => {
    return (
      <div style={{ textAlign: 'center' }}>
        <Switch checked={value.pagepermisson} onChange={()=>onChange(value)}/>
      </div>
    )
  }
  //控制列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <Tag color="magenta">{id}</Tag>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (value) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => deleteRights(value)} />&nbsp;&nbsp;&nbsp;
            <Popover content={content(value)} title="页面配置项" trigger={value.pagepermisson!==undefined ? 'hover' : ''}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={!value.pagepermisson} />
            </Popover>
          </div>
        )
      }
    }
  ];
  //权限状态
  const [data, setData] = useState([])
  //获取数据
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data);
      res.data.forEach(item => {
        if (item.children.length === 0) {
          delete item.children
        }
      })
      setData(res.data)
    })
  }, [])
  //删除按钮
  const deleteRights = (value) => {
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
    if (value.grade === 1) {
      setData(data.filter(item => item.id !== value.id))
      axios.delete(`/rights/${value.id}`)
    } else {
      const faData = data.find(item => item.id === value.rightId)
      faData.children = faData.children.filter(item => item.id !== value.id)
      setData([...data])
      axios.delete(`/children/${value.id}`)
    }
  }
  //修改switch状态
  const onChange=value=>{
    value.pagepermisson=value.pagepermisson?0:1
    setData([...data])
    if(value.grade===1){
      axios.patch(`/rights/${value.id}`,{
        pagepermisson:value.pagepermisson
      })
    }else{
      axios.patch(`/children/${value.id}`,{
        pagepermisson:value.pagepermisson
      })
    }
  }
  
  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 7 }} />
    </div>
  )
}
