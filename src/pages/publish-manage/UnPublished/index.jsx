import React from 'react'
import Room from '../../../components/publish-manage/Room'
import useGetData from '../../../components/publish-manage/useGetData'
import { Button } from 'antd'

export default function UnPublished() {
  const { dataSource, handleUnPublish } = useGetData(1)

  return (
    <Room dataSource={dataSource}
      render={(value) => <Button size='large' type="primary" onClick={()=>handleUnPublish(value)}>发布</Button>} />
  )
}
