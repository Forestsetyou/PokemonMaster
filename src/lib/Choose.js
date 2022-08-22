import React from "react";
import { viewList } from "./skillList";

export class Choose extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tic:1,
        }
    }

    handleChange(event,num){
        this.state[num]=event.target.value;
    }

    render(){
        var nextBut;
        var skill=[];
        var skillList=[];
        var toChi=[     //中文字符转化
            null,
            '一',
            '二',
            '三',
            '四',
        ];
        
        if(this.props.skillNumber===4)
            nextBut=<button onClick={() => this.props.handlePage(2)}>
                选择完毕!
            </button>;
        else
            nextBut=(<button onClick={() => {this.props.handlePage(2)}} disabled>
                选择完毕!
            </button>);
        
        for(let key in this.props.list){
            if(this.props.list[key] === false && key in viewList){
                skillList.push(<option value={key} key={key}></option>);    //创建JSX元素数组，直接将数组渲染即可,若此则需要添加Key
            }
        }
        for(let num=1;num<=4;num+=1){
            if(this.props.PP[num]===null)
                skill[num]=
                <div key={num.toString()}>
                    <label>技能栏{toChi[num]}：</label><br />
                    <input list='skill' type='text' onChange={(event) => this.handleChange(event,num)}></input>
                    <datalist id='skill'>
                        {skillList}
                    </datalist>
                     <input type='button' value='选择一个新技能' onClick={()=>{this.props.handleSkill(num,this.state[num])}}></input>
                </div>
            else
                skill[num]=
                <div key={num.toString()} onSubmit={this.handleSubmit}>
                    <label>技能栏{toChi[num]}：{this.props.PP[num].name}</label><br />
                    <input list='skill' type='text' onChange={(event) => this.handleChange(event,num)}></input>
                    <datalist id='skill'>
                        {skillList}
                    </datalist>
                     <input type='button' value='选择一个新技能' onClick={()=>{this.props.handleSkill(num,this.state[num])}}></input>
                </div>
        }


        return(
            <div id='choosingPage'>
                <div className="block"></div>
                <h1>{this.props.P1}</h1>
                {skill}
                {nextBut}
                <button onClick={()=>{this.props.godBut();this.props.handlePage(2)}}>随机技能</button>
            </div>
        )
    }

}