import { randomCheck } from "./randomCheck";

export function checkCritical(C){
    if(C===1){
        if(randomCheck(100/24)) return true;
    }
    if(C===2){
        if(randomCheck(100/8)) return true;
    }
    if(C===3){
        if(randomCheck(50)) return true;
    }

}