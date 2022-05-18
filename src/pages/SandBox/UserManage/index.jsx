import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AddForm from '../../../components/UserManage/AddForm'
import UpdateForm from '../../../components/UserManage/UpdateForm'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Button, Tag, Modal, Switch } from 'antd';
import PubSub from 'pubsub-js'
const { confirm } = Modal;

export default function UserManage() {
  //用户状态
  const [data, setData] = useState([])
  //地区状态
  const [regionsData, setRegionsData] = useState([])
  //角色状态
  const [rolesData, setRolesData] = useState([])
  //显示更新按钮
  const [isShowUpdate, setIsShowUpdate] = useState(false)
  //当前角色状态
  const [currentUser, setCurrentUser] = useState([])
  //当前更新角色id
  const [currentUpdateID, setCurrentUpdateID] = useState(0)
  //控制列
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [...regionsData.map(item=>({text:item.title,value:item.value})),{text:'全球',value:'全球'}],
      onFilter: (value, item) => {
        if(value==='全球'){
          return item.region===''
        }
        return item.region===value
      },
      render: (region) => {
        return <b color="#2db7f5">{region ? region : '全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return <Tag color="orange">{username}</Tag>
      }
    },
    {
      title: '用户状态',
      render: (value) => {
        return <Switch checked={value.roleState} disabled={value.default} onChange={() => handleChecked(value)} />
      }
    },
    {
      title: '操作',
      render: (value) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} disabled={value.default}
              onClick={() => handleDelete(value)} />&nbsp;&nbsp;&nbsp;
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={value.default}
              onClick={() => openUpdate(value)} />
          </div>
        )
      }
    }
  ];
  //当前登录用户数据
  const currentUserDATA=JSON.parse(window.localStorage.getItem('token'))
  //获取数据
  useEffect(() => {
    //用户数据
    axios.get('/users?_expand=role').then(res => {
      if(currentUserDATA.roleId===2){
        res.data=res.data.filter(item=>{
          return item.id===currentUserDATA.id || item.region===currentUserDATA.region && item.roleId===3
        })
      }
      setData(res.data)
    })
    //地区数据
    axios.get('/regions').then(res => {
      setRegionsData(res.data)
    })
    // 角色数据
    axios.get('/roles').then(res => {
      setRolesData(res.data)
    })
  }, [])
  //订阅更新用户
  useEffect(() => {
    const subUpdate = PubSub.subscribe('updateUser', (_, changeUser) => {
      handleChange(changeUser)
    });
    return () => {
      PubSub.unsubscribe(subUpdate);
    }
  }, [currentUpdateID])
  //订阅添加用户
  useEffect(() => {
    const sub = PubSub.subscribe('newUser', (_, newUser) => {
      handleAdd(newUser)
    });
    return () => {
      PubSub.unsubscribe(sub);
    }
  }, [rolesData])
  //处理添加用户
  const handleAdd = newUser => {
    axios.post('/users', newUser).then(res => {
      const t = rolesData.find(item => {
        return item.roleType === res.data.roleId
      })
      res.data.role = t
      setData([...data, res.data])
    })
  }
  //删除按钮
  const handleDelete = value => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        confirmDelete(value)
      },
    });
  }
  //执行删除操作
  const confirmDelete = value => {
    setData(data.filter(item => item.id !== value.id))
    axios.delete(`/users/${value.id}`)
  }
  //打开更新按钮
  const openUpdate = value => {
    setCurrentUpdateID(value.id)
    setIsShowUpdate(true)
    setCurrentUser(value)
  }
  //控制更新按钮
  const updateButton = isShow => {
    setIsShowUpdate(isShow)
  }
  //处理更新
  const handleChange = changeUser => {
    if (changeUser.roleId === 1) changeUser.region = ''
    changeUser.role = rolesData.find(item => item.roleType === changeUser.roleId)
    let obj = data.find(item => item.id === currentUpdateID)
    obj = Object.assign(obj, changeUser)
    console.log(obj);
    setData([...data])
    axios.patch(`/users/${currentUpdateID}`, changeUser)
  }
  //处理用户状态
  const handleChecked = value => {
    data.forEach(item => {
      if (item.id === value.id) {
        item.roleState = !item.roleState
      }
    })
    setData([...data])
    axios.patch(`/users/${value.id}`, { roleState: value.roleState })
  }

  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <AddForm regionsData={regionsData} rolesData={rolesData} />
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 7 }} rowKey={item => item.id} />
      <UpdateForm regionsData={regionsData} rolesData={rolesData} isShowUpdate={isShowUpdate}
        updateButton={updateButton} currentUser={currentUser} />
    </div>
  )
}

