import _ from "lodash";
import React from "react";
import { skillIndex } from "./skillIndex";

export class pictureMonster extends React.Component{       //角色渲染器
    constructor(props){
        super(props);
        this.state={
            PP:{},
        };
        for(let i in this.props.player.monster[this.props.player.monster.state.inBattle].PP){
            this.state.PP[i]=this.props.player.monster[this.props.player.monster.state.inBattle].PP[i];
        }
    }

    render(){
        let num=this.props.player.monster.state.inBattle;
        let monster=this.props.player.monster[num];
        let states=monster.ability.states;
        let pic=monster.src;

        let feature={
            'normal':'普通',
            'dragon':'龙',
            'fire':'火',
            'water':'水',
            'fly':'飞行',
            'ghost':'幽灵',
            'ground':'地面',
            'fighting':'格斗',
            'drak':'恶',
        }
        let featureColor={
            'normal':'dimgray',
            'dragon':'navy',
            'fire':'red',
            'water':'royalblue',
            'fly':'skyblue',
            'ghost':'lightgray',
            'ground':'goldenrod',
            'fighting':'sienna',
            'drak':'black',
            '???':'black',
            '?':'rgba(0,0,0,0)',
        }

        let PP=this.state.PP;
        
        let buttonSkill={};
        let buttonAble={};

        for(let i=1;i<=4;i++){
            if(PP[i].PP===0 || this.props.Ani){
                buttonAble[i]=true;
            }
            buttonSkill[i]=<p className="buttonSkill">
                <font color={featureColor[PP[i].feature]}>{feature[PP[i].feature]}</font><span> {PP[i].name}</span><br />
                <span>PP:{PP[i].PP} 威力:{PP[i].harm}</span>
            </p>
        }


        let attributeList={
            At:'攻击',
            Sa:'特攻',
            Df:'防御',
            Sd:'特防',
            Sp:'速度',
            paralysis:'麻痹',
            burn:'烧伤',
            block:'守住',
        }
        let hpCal=10+220*(monster.ability.aniHP/monster.ability.maxHP);
        let hpColor;
        let hpRadius;

        if(monster.ability.aniHP/monster.ability.maxHP<=0.25){
            hpColor='red';
        } else {
            if(monster.ability.aniHP/monster.ability.maxHP<=0.5){
                hpColor='yellow';
            } else hpColor='green';
        }

        if(hpCal>=155){
            hpRadius='10% / 100%';
        } else {
            if(hpCal>=115){
                hpRadius='15% / 100%';
            } else {
                if(hpCal>=100){
                    hpRadius='17% / 100%';
                } else {
                    if(hpCal>=85){
                        hpRadius='20% / 100%';
                    } else {
                        if(hpCal>=77){
                            hpRadius='20% / 90%';
                        } else {
                            if(hpCal>=60){
                                hpRadius='25% / 90%';
                            } else {
                                if(hpCal>=55){
                                    hpRadius='30% / 100%';
                                } else {
                                    if(hpCal>=47){
                                        hpRadius='30% / 80%';
                                    } else{
                                        if(hpCal>=40){
                                            hpRadius='35% / 85%';
                                        } else {
                                            if(hpCal>=37){
                                                hpRadius='40% / 85%';
                                            } else {
                                                if(hpCal>=30){
                                                    hpRadius='45% / 80%';
                                                } else {
                                                    if(hpCal>=25){
                                                        hpRadius='50% / 75%';
                                                    }else{
                                                        if(hpCal>=20){
                                                            hpRadius='60% / 75%';
                                                        } else {
                                                            hpRadius='70% / 70%';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        let hpText={
            marginLeft: '10px',
            marginTop: '3px',
            border: '2.5px solid #8B5A00',
            paddingLeft: '0.5px',
            paddingTop:'0.5px',
            paddingBottom: '0.5px',
            width:'230px',
            height:'15px',
            backgroundColor: 'white',
            borderRadius: '10% / 100%',
        };
        let hpText2={
            display:'inlineBlock',
            backgroundColor: hpColor,
            width: hpCal+'px',
            height:'14.5px',
            margin:0,
            paidding:0,
            borderRadius: hpRadius,
        };
        let HPStream=<div style={hpText}>
            <div style={hpText2}></div>
        </div>;

        let stateOption=[];
        

        for(let i in states.attribute){     //属性等级
            if(states.attribute[i] > 0){
                stateOption.push(<option key={i}>
                    {attributeList[i]}:上升{states.attribute[i]}级
                </option>)
            } else 
                if(states.attribute[i] < 0){
                    stateOption.push(<option key={i}>
                        {attributeList[i]}:下降{-states.attribute[i]}级
                    </option>)
                }
        }

        for(let i in states.abnormal){      //异常状态
            if(states.abnormal[i].checks){
                stateOption.push(<option>
                    {attributeList[i]}
                </option>)
            }
        }

        return(
            <div id={this.props.id}>
                <div className="block"></div>
                <div id='cardUp'>
                    <div className='nameAndLV'>
                        <p>
                        LV:{monster.LV+'  '}{monster.name+'  '}
                            <select id='states'>
                                <option className="nameAndLV">状态栏</option>
                                {stateOption}
                            </select>
                            <span>
                            {' '}HP:{monster.ability.aniHP}/{monster.ability.maxHP}
                            </span>
                        </p>
                    </div>
                    {HPStream}
                    <img src={pic} alt='甲贺忍蛙' className="AVG"></img>
                </div>
                <div id='skillButton'>
                    <div id='skillRow'>
                        <button className="leftBut" disabled={buttonAble[1]}>{buttonSkill[1]}</button>
                        <button className="rightBut" disabled={buttonAble[2]}>{buttonSkill[2]}</button>
                    </div>
                    <div id='skillRow'>
                        <button className="leftBut" disabled={buttonAble[3]}>{buttonSkill[3]}</button>
                        <button className="rightBut" disabled={buttonAble[4]}>{buttonSkill[4]}</button>
                    </div>
                </div>
            </div>
        );
    }

}

