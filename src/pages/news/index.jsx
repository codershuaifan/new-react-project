import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash'

export default function News() {
  //新闻状态
  const [newsData, setnewsData] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      res.data = Object.entries(_.groupBy(res.data, item => item.category.title))
      setnewsData(res.data)
    })
  }, [])
  return (
    <div style={{ padding: '30px' }}>
      <PageHeader title="新闻分类" subTitle="查看新闻" />
      <Row gutter={[16, 16]}>
        {
          newsData.map(item => {
            return (
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={true} hoverable>
                  <List
                    size="large" pagination={{ pageSize: 2 }} dataSource={item[1]}
                    renderItem={item => <List.Item><Link to={`/detail/${item.id}`}>{item.title}</Link></List.Item>}
                  />
                </Card>
              </Col>
            )
          })
        }
      </Row>
    </div>
  )
}
