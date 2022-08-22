export function randomCheck(rate){
    // console.log('randomCheck');
    let check=Math.floor(Math.random() * 100 + 1);
    if(check < rate) return true;
    else return false;
}