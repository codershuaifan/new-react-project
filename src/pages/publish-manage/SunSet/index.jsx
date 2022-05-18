import React from 'react'
import Room from '../../../components/publish-manage/Room'
import useGetData from '../../../components/publish-manage/useGetData'
import { Button } from 'antd'

export default function SunSet() {
  const { dataSource, handleSunSet } = useGetData(3)

  return (
    <Room dataSource={dataSource}
      render={(value) => <Button size='large' type="danger" onClick={()=>handleSunSet(value)}>删除</Button>} />
  )
}
