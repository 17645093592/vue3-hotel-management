import { ElMessage ,ElMessageBox} from 'element-plus'

// 成功
export let $msg_s = (message,duration = 500)=>{
    ElMessage({
        showClose:true,
        message,
        duration,
        type: 'success',
      })
}   
// 警告
export let $msg_w = (message,duration = 500)=>{
    ElMessage({
        showClose:true,
        message,
        duration,
        type: 'warning',
      })
}   

// 错误
export let $msg_e = (message,duration = 500)=>{
    ElMessage({
        showClose:true,
        message,
        duration,
        type: 'error',
      })
}   

export let $confirm = (message,title='提示',type='warning')=>{
  return new Promise((reslove,reject)=>{
    ElMessageBox.confirm(
      message,
      title,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type,
      }
    )
      .then(() => {
        reslove() 
      })
      .catch(() => {
      })
  })
}