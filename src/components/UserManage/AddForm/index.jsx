import React, { useState } from 'react'
import { Button, Modal, Form, Input, Select } from 'antd';
import PubSub from 'pubsub-js'
const { Option } = Select


export default function From({regionsData,rolesData}) {
  //对话框显示状态
  const [visible, setVisible] = useState(false);
  //控制地区是否显示状态
  const [showRegion,setShowRegion]=useState(false)
  const [form] = Form.useForm();
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))

  //对话框确认按钮
  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields()
      values.region=values.region?values.region:''
      values.default=false
      values.roleState='true'
      PubSub.publish('newUser', values);
      setVisible(false);
    }).catch((info) => {
      console.log('表单验证失败:', info);
    });
  }
  //控制地区是否显示
  const handleRegion=(value)=>{
    if(value===1){
      setShowRegion(true)
    }else setShowRegion(false)
  }
  //控制下拉选择框-地区
  const isDisabledRegion=value=>{
    if(currentUserDATA.roleId===1){
      return false
    }else{
      return currentUserDATA.region!==value.value
    }
  }
  //控制下拉选择框-角色
  const isDisabledRole=value=>{
    if(currentUserDATA.roleId===1){
      return false
    }else{
      return value.roleType===1
    }
  }

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); }}>
        添加用户
      </Button>
      <Modal visible={visible} title="添加用户" onCancel={() => setVisible(false)} onOk={handleOk}>
        {/* 表单 */}
        <Form form={form} layout="vertical" name="form_in_modal" >
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请检查字段' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请检查字段' }]}>
            <Input type='password' />
          </Form.Item>
          {/* 区域 */}
          <Form.Item name="region" label="区域" rules={showRegion?'':[{ required: true, message: '请检查字段' }]}>
            <Select disabled={showRegion}>
              {regionsData.map(item=>{
                return <Option value={item.value} key={item.id} disabled={isDisabledRegion(item)}>{item.title}</Option>
              })}
            </Select>
          </Form.Item>
          {/* 角色 */}
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请检查字段' }]}>
            <Select onChange={handleRegion}>
              {rolesData.map(item=>{
                return <Option value={item.roleType} key={item.id} disabled={isDisabledRole(item)}>{item.roleName}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
