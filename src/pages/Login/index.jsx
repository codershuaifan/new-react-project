import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message, Popover, Tag } from 'antd';
import style from './index.module.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//粒子参数
const particlesInit = async (main) => {
  await loadFull(main);
};
const options = {
  "background": {
    "color": {
      "value": "#232741"
    },
    "position": "50% 50%",
    "repeat": "no-repeat",
    "size": "cover"
  },
  // 帧数，越低越卡,默认60
  "fpsLimit": 120,
  "interactivity": {
    "events": {
      "onClick": {
        "enable": true,
        "mode": "push"
      },
      "onHover": {
        "enable": true,
        "mode": "slow"
      }
    },
    "modes": {
      "push": {
        //点击是添加1个粒子
        "quantity": 3,
      },
      "bubble": {
        "distance": 200,
        "duration": 2,
        "opacity": 0.8,
        "size": 20,
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "mix": false,
          "selectors": []
        }
      },
      "grab": {
        "distance": 400
      },
      //击退
      "repulse": {
        "divs": {
          //鼠标移动时排斥粒子的距离
          "distance": 200,
          //翻译是持续时间
          "duration": 0.4,
          "factor": 100,
          "speed": 0.5,
          "maxSpeed": 50,
          "easing": "ease-out-quad",
          "selectors": []
        }
      },
      //缓慢移动
      "slow": {
        //移动速度
        "factor": 1,
        //影响范围
        "radius": 200,
      },
      //吸引
      "attract": {
        "distance": 200,
        "duration": 0.4,
        "easing": "ease-out-quad",
        "factor": 3,
        "maxSpeed": 50,
        "speed": 0.5

      },
    }
  },
  //  粒子的参数
  "particles": {
    //粒子的颜色
    "color": {
      "value": "#ffffff"
    },
    //是否启动粒子碰撞
    "collisions": {
      "enable": true,
    },
    //粒子之间的线的参数
    "links": {
      "color": {
        "value": "#ffffff"
      },
      "distance": 150,
      "enable": true,
      "warp": true
    },
    "move": {
      "attract": {
        "rotate": {
          "x": 600,
          "y": 1200
        }
      },
      "enable": true,
      "outModes": {
        "bottom": "out",
        "left": "out",
        "right": "out",
        "top": "out"
      },
      "speed": 3,
      "warp": true
    },
    "number": {
      "density": {
        "enable": true
      },
      //初始粒子数
      "value": 40
    },
    //透明度
    "opacity": {
      "value": 0.5,
      "animation": {
        "speed": 1,
        "minimumValue": 0.1
      }
    },
    //大小
    "size": {
      "random": {
        "enable": true
      },
      "value": {
        "min": 1,
        "max": 3
      },
      "animation": {
        "speed": 20,
        "minimumValue": 0.1
      }
    }
  }
}


export default function Login() {
  //用户状态
  const [userData, setuserData] = useState([])
  useEffect(() => {
    axios.get('/users').then(res => {
      console.log(res.data);
      setuserData(res.data)
    })
  }, [])
  const navigate = useNavigate()
  //表单验证成功后
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if (res.data.length) {
        const data = JSON.stringify(res.data[0])
        window.localStorage.setItem('token', data)
        navigate('/')
        message.success('登陆成功');
      } else message.error('登陆失败');
    })
  };
  //用户列表
  const arr = ['超级管理员', '区域管理员', '区域编辑']
  const content = (
    <div className={style.box}>
      {
        userData.map(item =>
          <div key={item.id}>
            <div className={style.content}><Tag color='orange'>{item.username}</Tag></div>
            <div className={style.write}>{item.password}</div>
            <b className={style.font}>{arr[item.roleId - 1]}</b>
          </div>)
      }
    </div>
  );
  return (
    <div>
      <Particles id="tsparticles" init={particlesInit} options={options} />
      <div className={style.card}>
        <div className={style.name}>全球新闻发布管理</div>
        <Form initialValues={{ remember: true, }} onFinish={onFinish} className={style.form}>
          <Form.Item name="username" rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            <Button className={style.button} onClick={()=>navigate('/news')}>
              游客系统
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Popover content={content} title="用户列表" className={style.list}>
        <Button type="primary">用户列表</Button>
      </Popover>
    </div>
  )
}
