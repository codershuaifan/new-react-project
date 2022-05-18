import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { PageHeader, Descriptions, Card } from 'antd';
import axios from 'axios';
import moment from 'moment';

const auditList = ['未审核', '审核中', '已通过', '未通过']
const publishList = ['未发布', '待发布', '已上线', '已下线']
const colorList=['black','orange','green','red']

export default function Detail() {
  //获取params参数
  const params = useParams()
  //预览状态
  const [previewState, serPreviewState] = useState([])
  //获取数据
  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      console.log(res.data);
      serPreviewState(res.data)
    })
  }, [])
  const { author, createTime, publishTime, region, auditState, publishState, view, star, title, category, content } = previewState


  return (
    <PageHeader ghost={false} onBack={() => window.history.back()} title={title} subTitle={category?.title}>
      {
        previewState.length === 0 ? <div>Loding...</div> :
          <Descriptions column={3} contentStyle={{ fontWeight: 'bold', fontSize: '20px' }} labelStyle={{ fontSize: '20px' }}>
            <Descriptions.Item label="创建者">{author}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{moment(createTime).format('YYYY/MM/DD-HH:MM')}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{publishTime ? publishTime : '-'}</Descriptions.Item>
            <Descriptions.Item label="区域">{region}</Descriptions.Item>
            <Descriptions.Item label="审核状态" contentStyle={{ color: colorList[auditState] }}>{auditList[auditState]}</Descriptions.Item>
            <Descriptions.Item label="发布状态" contentStyle={{ color: colorList[publishState] }}>{publishList[publishState]}</Descriptions.Item>
            <Descriptions.Item label="访问数量">{view}</Descriptions.Item>
            <Descriptions.Item label="点赞数量">{star}</Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
          </Descriptions>
      }
      <Card style={{backgroundColor:'#DDDDDD',overflow:'auto'}}>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </Card>

    </PageHeader>
  )
}
