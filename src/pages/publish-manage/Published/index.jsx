import React from 'react'
import Room from '../../../components/publish-manage/Room'
import useGetData from '../../../components/publish-manage/useGetData'
import { Button } from 'antd'

export default function Published() {
  const { dataSource,handlePublish } = useGetData(2)
  return (
    <Room dataSource={dataSource}
      render={(value) => <Button size='large' type="danger" onClick={()=>handlePublish(value)}>下线</Button>} />
  )
}
