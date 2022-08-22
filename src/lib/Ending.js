import React from "react";

export class Ending extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(<div>
            <button onClick={()=>this.props.messageOut('等待消磨了时光...')}>ClickME!</button>
            <p>{this.props.msg}</p>
            </div>
        )
    }


}