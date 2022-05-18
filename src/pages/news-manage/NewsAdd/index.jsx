import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { PageHeader, Steps, Button, message, Form, Input, Select, notification } from 'antd';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from 'axios';
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {
  const formRef = useRef()
  const navigate = useNavigate()
  //当前登录用户数据
  const currentUserDATA = JSON.parse(window.localStorage.getItem('token'))
  //步骤条状态
  const [current, setCurrent] = useState(0);
  //文章分类状态
  const [cateData, setCateDate] = useState([])
  //富文本编辑器状态
  const [editorState, setEditorState] = useState('')
  //富文本数据
  const [editorData, setEditorDate] = useState('')
  //文章数据
  const [titleData, setTitleDate] = useState({})
  //富文本编辑器
  const onEditorStateChange = () => {
    setEditorDate(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }
  //步骤条内容
  const steps = [
    {
      title: '基本信息',
      content: <Form name="basic" layout="vertical" size='large'
        style={{ width: '50%', margin: '0 auto', marginTop: '40px' }} ref={formRef}>
        <Form.Item label="新闻标题" name="title"
          rules={[
            {
              required: true,
              message: '请校验字段',
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item label="新闻分类" name="categoryId"
          rules={[
            {
              required: true,
              message: '请校验字段',
            },
          ]}>
          <Select>
            {cateData.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)}
          </Select>
        </Form.Item>
      </Form>,
    },
    {
      title: '新闻内容',
      content: <Editor editorState={editorState} onEditorStateChange={state => setEditorState(state)} onBlur={onEditorStateChange} />,
    },
    {
      title: '新闻提交',
      content: '',
    },
  ];
  //获取数据
  useEffect(() => {
    axios.get('/categories').then(res => {
      setCateDate(res.data)
    })
  }, [])
  //点击下一步
  const next = () => {
    if (current === 0) {
      formRef.current.validateFields().then(res => {
        setTitleDate(res)
        setCurrent(current + 1)
      }).catch(err => {
        message.error('发生错误了')
      })
    }
    if (current === 1) {
      if (editorData === '' || editorData.trim() === '<p></p>') {
        message.error('请输入内容')
      } else setCurrent(current + 1)
    }
  }
  //保存到草稿箱
  const handleSave = auditState => {
    axios.post('/news', {
      "title": titleData.title,
      "categoryId": titleData.categoryId,
      "content": editorData,
      "region": currentUserDATA.region ? currentUserDATA.region : '全球',
      "author": currentUserDATA.username,
      "roleId": currentUserDATA.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then(res => {
      navigate(auditState ? '/audit-manage/list' : '/news-manage/draft')

      notification.open({
        message: '通知',
        description:`您可以到${auditState?'审核列表':'草稿箱'}中查看`,
        placement:'bottomRight'
      });
    })
  }

  return (
    <div>
      {/* 页头 */}
      <PageHeader title="撰写新闻" subTitle="This is a subtitle" />
      {/* 步骤条 */}
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <>
            <Button type="primary" onClick={() => handleSave(1)}>
              提交审核
            </Button>
            <Button danger onClick={() => handleSave(0)}>
              保存到草稿箱
            </Button>
          </>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => setCurrent(current - 1)}>
            上一步
          </Button>
        )}
      </div>
    </div>
  )
}
