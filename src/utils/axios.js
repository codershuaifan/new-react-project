import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../redux/store'

axios.defaults.baseURL='https://gnms.herokuapp.com/api'

axios.interceptors.request.use(config=>{
  nprogress.start()
  store.dispatch({type:'isSpinning',data:true})
  return config
})

axios.interceptors.response.use(config=>{
  nprogress.done()
  store.dispatch({type:'isSpinning',data:false})
  return config
})