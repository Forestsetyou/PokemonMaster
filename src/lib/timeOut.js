export async function timeOut(num){
    let promise=await new Promise(resolve=>{
        setTimeout(()=>resolve('timeout!'),num);
    })
    return ;
}