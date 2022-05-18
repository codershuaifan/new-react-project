import React, { useState, useEffect,useRef } from 'react'
import { List,Button, Input,Modal,message } from 'antd';
import axios from 'axios'

export default function NewsCategory() {
  //对话框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  //新闻分类状态
  const [dataSource, setDataSource] = useState([])
  //当前id
  const [currentId,setCurrentId]=useState(0)
  const inputRef=useRef()
  //获取数据
  useEffect(() => {
    axios.get('/categories').then(res => {
      setDataSource(res.data)
    })
  }, [])
  //对话框打开
  const changeTitle=value=>{
    setIsModalVisible(true)
    setCurrentId(value.id)
  }
  //修改新闻标题
  const handleOk=()=>{
    console.log(inputRef);
    const value=inputRef.current.input.value
    const data=dataSource.find(item=>item.id===currentId)
    data.title=value
    data.value=value
    setDataSource([...dataSource])
    axios.patch(`/categories/${currentId}`,{
      title:value,
      value
    }).then(res=>{
      message.success('成功修改')
    }).catch(()=>message.error('修改失败'))
  }

  return (
    <div>
      <List header={<b>新闻分类</b>} bordered dataSource={dataSource} size="large"
        renderItem={item => (
          <List.Item style={{fontSize:'20px',display:'flex',flex:1}}>
            <span>id:<span style={{color:'orange'}}>{item.id}</span></span>
            {item.title}
            <Button type='primary' onClick={()=>changeTitle(item)}>修改</Button>
          </List.Item>
        )}
      />
      <Modal title="修改新闻分类" visible={isModalVisible} onOk={handleOk} onCancel={()=>setIsModalVisible(false)}>
        <Input placeholder='输入新闻分类' ref={inputRef}></Input>
      </Modal>
    </div>
  )
}
