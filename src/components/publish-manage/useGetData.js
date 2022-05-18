import {useState,useEffect} from 'react'
import axios from 'axios'
import { message } from 'antd'

export default function useGetData(state){
  //数据状态
  const [dataSource, setDataSource] = useState([])
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))
  //获取数据
  useEffect(() => {
    axios.get(`/news?author=${currentUserDATA.username}&publishState=${state}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])
  //处理下线
  const handlePublish=(value)=>{
    setDataSource(dataSource.filter(item=>item.id!==value.id))
    axios.patch(`/news/${value.id}`,{publishState:3})
    message.success('该条新闻已下线')
  }
  //处理发布
  const handleUnPublish=(value)=>{
    setDataSource(dataSource.filter(item=>item.id!==value.id))
    axios.patch(`/news/${value.id}`,{publishState:2})
    message.success('该条新闻已发布')
  }
  //处理删除
  const handleSunSet=(value)=>{
    setDataSource(dataSource.filter(item=>item.id!==value.id))
    axios.delete(`/news/${value.id}`)
    message.success('该条新闻已删除')
  }

  return {
    dataSource,
    handlePublish,
    handleUnPublish,
    handleSunSet
  }
}