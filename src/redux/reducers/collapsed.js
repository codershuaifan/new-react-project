const initState=false

export default function collapsed(preState=initState,action){
  const {type}=action
  switch (type) {
    case 'change':
      return !preState
    default:
      return preState
  }
}