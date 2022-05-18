export default function spinning(preState=false,action){
  const {type,data}=action
  switch (type) {
    case 'isSpinning':
      return data
    default:
      return preState
  }
}