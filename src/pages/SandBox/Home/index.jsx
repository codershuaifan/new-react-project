import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Comment, Tooltip, Drawer } from 'antd';
import {
  EditOutlined, EllipsisOutlined, SettingOutlined, AntDesignOutlined, LikeFilled, DislikeFilled
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios'
import moment from 'moment';
import * as echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  const chartRef = useRef()
  //抽屉状态
  const [visible, setvisible] = useState(false)
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))
  //最常浏览数据
  const [viewData, setViewData] = useState([])
  //点赞最多数据
  const [starData, setStarData] = useState([])
  //饼状图数据
  const [round, setround] = useState([])
  useEffect(() => {
    //用户最常浏览数据
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setViewData(res.data)
    })
    //用户点赞最多数据
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      setStarData(res.data)
    })
    //饼状图数据
    axios.get(`/news?publishState=2&_expand=category`).then(res=>{
      res.data=Object.entries(_.groupBy(res.data,item=>item.category.title))
      const data=[]
      res.data.forEach(item=>{
        data.push({value:item[1].length,name:item[0]})
      })
      setround(data)
    })
  }, [])
  //饼状图数据
  const option = {
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 250],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: round
      }
    ]
  };
  //点赞
  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <LikeFilled />10
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <DislikeFilled />2
    </Tooltip>,
    <span key="comment-basic-reply-to">Reply to</span>,
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={<b>用户最常浏览</b>} bordered={false} hoverable>
            <List
              bordered
              dataSource={viewData}
              renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable
            cover={<img alt="" src="https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />}
            actions={[<SettingOutlined key="setting" style={{ fontSize: '20px', color: 'blue' }}
              onClick={() => {
                setTimeout(() => {
                  setvisible(true)
                  //饼状图配置
                  let myChart = echarts.init(chartRef.current);
                  option && myChart.setOption(option);
                }, 0)
              }} />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={<span style={{ color: 'orange', fontSize: '20px' }}>{currentUserDATA.username}</span>}
              description={<div>
                <b>{currentUserDATA.region ? currentUserDATA.region : '全球'}</b>
                <span style={{ marginLeft: '10px' }}>{currentUserDATA.role.roleName}</span>
              </div>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<b>用户点赞最多</b>} bordered={false} hoverable>
            <List
              bordered
              dataSource={starData}
              renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={10}>
          <Comment
            actions={actions}
            author={<b>评论</b>}
            avatar={<Avatar icon={<AntDesignOutlined />} alt="Han Solo" />}
            content={
              <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure), to help people create their product prototypes beautifully
                and efficiently.
              </p>
            }
            datetime={
              <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </Col>
        <Col span={4}>

        </Col>
        <Col span={7}>
          <Card hoverable bodyStyle={{ backgroundColor: '#D5D5D5' }} title="作者简介">
            <div>
              姓名:<b style={{ marginLeft: '10px' }}>黄*</b>
              <span style={{ marginLeft: '95px' }}>学校:<b>盐城师范学院</b></span>
            </div>
            <div>
              年龄:<b style={{ marginLeft: '10px' }}>21</b>
              <span style={{ marginLeft: '100px' }}>专业:<b>数字媒体技术</b></span>
            </div>
          </Card>
        </Col>
      </Row>
      {/* 抽屉 */}
      <Drawer title="个人新闻分类" placement="right" onClose={() => setvisible(false)} visible={visible} size='large'>
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </Drawer>
    </div>
  )
}
