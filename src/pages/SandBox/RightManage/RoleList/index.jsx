import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, Tree } from 'antd';
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


export default function RoleList() {
  //角色状态
  const [data, setData] = useState([])
  //对话框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  //权限状态
  const [rightsData, setRightsData] = useState([])
  //当前角色权限状态
  const [currentRights,setCurrentRights]=useState([])
  //当前角色的树形控件id
  const [currentId,setCurrentId]=useState('')

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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (value) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => deleteRights(value)} />&nbsp;&nbsp;&nbsp;
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {setIsModalVisible(true);setCurrentRights(value.rights);setCurrentId(value.id)}} />
          </div>
        )
      }
    }
  ];
  //获取数据
  useEffect(() => {
    axios.get('/roles').then(res => {
      console.log(res.data);
      setData(res.data)
    })
    axios.get('/rights?_embed=children').then(res => {
      res.data.forEach(item => {
        if (item.children.length === 0) {
          delete item.children
        }
      })
      setRightsData(res.data)
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
    setData(data.filter(item => item.id !== value.id))
    axios.delete(`/roles/${value.id}`)
  }
  //选中树形控件按钮
  const onCheck=(keys)=>{
    setCurrentRights(keys.checked)
  }
  //树形控件确认按钮
  const handleOk=()=>{
    setIsModalVisible(false)
    const current=data.find(item=>item.id===currentId)
    current.rights=currentRights
    setData([...data])
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }

  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 7 }} rowKey={item => item.id}/>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={()=>setIsModalVisible(false)}>
        <Tree
          checkable
          checkStrictly
          onCheck={onCheck}
          checkedKeys={currentRights}
          treeData={rightsData}
        />
      </Modal>
    </div>
  )
}
