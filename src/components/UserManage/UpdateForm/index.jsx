import React, { useState, useEffect, useRef } from 'react'
import { Modal, Form, Input, Select } from 'antd';
import PubSub from 'pubsub-js'
const { Option } = Select


function From({ regionsData, rolesData, isShowUpdate, updateButton, currentUser }) {
  //控制地区是否显示状态
  const [showRegion, setShowRegion] = useState(false)
  const [form] = Form.useForm();
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))

  const formRef = useRef(null)
  //对话框确认按钮
  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields()
      PubSub.publish('updateUser', values);
      updateButton(false)
    }).catch((info) => {
      console.log('发生错误:', info);
    });
  }
  //控制地区是否显示
  const handleRegion = (value) => {
    if (value === 1) {
      setShowRegion(true)
    } else setShowRegion(false)
  }
  //监听对话框打开
  useEffect(() => {
    if (isShowUpdate) {
      if (currentUser.roleId === 1) {
        setShowRegion(true)
      } else setShowRegion(false)
      formRef.current.setFieldsValue(currentUser)
    }
  }, [isShowUpdate])

  return (
    <Modal visible={isShowUpdate} title="添加用户" onCancel={() => updateButton(false)} onOk={handleOk}>
      {/* 表单 */}
      <Form form={form} layout="vertical" name="form_in_modal" ref={formRef}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请检查字段' }]}>
          <Input placeholder={currentUser.username} />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请检查字段' }]}>
          <Input type='password' />
        </Form.Item>
        {/* 区域 */}
        <Form.Item name="region" label="区域" rules={showRegion ? '' : [{ required: true, message: '请检查字段' }]}>
          <Select disabled={showRegion}>
            {regionsData.map(item => {
              return <Option value={item.value} key={item.id} disabled={currentUserDATA.roleId>1}>{item.title}</Option>
            })}
          </Select>
        </Form.Item>
        {/* 角色 */}
        <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请检查字段' }]}>
          <Select onChange={handleRegion}>
            {rolesData.map(item => {
              return <Option value={item.roleType} key={item.id} disabled={currentUserDATA.roleId===2}>{item.roleName}</Option>
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default From
