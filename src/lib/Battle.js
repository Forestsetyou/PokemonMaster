import _ from "lodash";
import React from "react";
import { skillIndex } from "./skillIndex";

function hpStream(hpCal){
    let hpRadius;
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
    return hpRadius;
}

export class Battle extends React.Component{       //???????????????
    constructor(props){
        super(props);
        this.state={
            player:{
                PP:{},
            },
            CPU:{
                PP:{},
            }
        };

        for(let i in this.props.player.monster[this.props.player.monster.state.inBattle].PP){
            this.state.player.PP[i]=this.props.player.monster[this.props.player.monster.state.inBattle].PP[i];
        }

    }

    render(){
        // console.log('Battle:');
        // console.log(this.props);

        let num1=this.props.player.monster.state.inBattle;
        let monster1=this.props.player.monster[num1];
        let states1=monster1.ability.states;
        let pic1=monster1.src;

        let num2=this.props.CPU.monster.state.inBattle;
        let monster2=this.props.CPU.monster[num2];
        let states2=monster2.ability.states;
        let pic2=monster2.src;

        let feature={
            'normal':'??????',
            'dragon':'???',
            'fire':'???',
            'water':'???',
            'fly':'??????',
            'ghost':'??????',
            'ground':'??????',
            'fighting':'??????',
            'drak':'???',
        }
        let featureColor={
            'normal':'rgba(145,153,161,1)',
            'dragon':'rgba(10,109,194,1)',
            'fire':'rgba(254,156,84,1)',
            'water':'rgba(79,144,213,1)',
            'fly':'rgba(142,168,222,1)',
            'ghost':'rgba(82,105,172,1)',
            'ground':'rgba(216,120,68,1)',
            'fighting':'rgba(205,64,106,1)',
            'drak':'rgba(90,83,101,1)',
            '???':'black',
            '?':'rgba(0,0,0,0)',
            'psychic':'rgba(149,113,120,1)',
            'ice':'rgba(115,106,291,1)',
        }

        let PP=this.props.player.monster[this.props.player.monster.state.inBattle].PP;
        if(PP[1]===null || PP[2]===null || PP[3]===null || PP[4]===null){
            PP=this.state.player.PP;
        }
        
        let buttonSkill={};
        let buttonAble={};
        
        // console.log('skill?');
        // console.log(PP);
        // console.log(this.props.all);

        if(!this.props.Ab){
            for(let i=1;i<=4;i++){
                if(PP[i].PP===0 || this.props.Ani){
                    buttonAble[i]=true;
                } else {
                    buttonAble[i]=false;
                }
                let buttonDir;
                if(i%2){
                    buttonDir='leftBut';
                }else{
                    buttonDir='rightBut';
                }
                let eStyle={
                    color:featureColor[PP[i].feature],
                };
                buttonSkill[i]=
                <button className={buttonDir} disabled={buttonAble[i]} onClick={()=>this.props.getRound(i)}>
                    <p className="buttonSkill">
                        <span style={eStyle}>{feature[PP[i].feature]}</span><span> {PP[i].name}</span><br />
                        <span>PP:{PP[i].PP} ??????:{PP[i].harm}</span>
                    </p>
                </button>
                
            }
        } else {
            if(!this.props.Cb){
                if(!this.props.isGolden){
                    buttonSkill[1]=
                        <button className='leftBut' disabled={this.props.Ani} onClick={()=>this.props.reset(1)}>
                            <p className="buttonSkill">
                                ?????????,???????????????
                            </p>
                        </button>
                    buttonSkill[2]=
                        <button className='rightBut' disabled={this.props.Ani} onClick={()=>this.props.reset(10)}>
                            <p className="buttonSkill">
                                ????????????????????????!
                                ?????????????????????~
                            </p>
                        </button>
                    buttonSkill[3]=
                        <button className='leftBut' disabled>
                            <p className="buttonSkill">
                            </p>
                        </button>
                    buttonSkill[4]=
                        <button className='rightBut' disabled>
                            <p className="buttonSkill">
                            </p>
                        </button>
                } else {
                    buttonSkill[1]=
                        <button className='leftBut' disabled={this.props.Ani} onClick={()=>this.props.reset(10)}>
                            <p className="buttonSkill">
                                ?????????,???????????????
                            </p>
                        </button>
                    buttonSkill[2]=
                        <button className='rightBut' disabled>
                            <p className="buttonSkill">
                            </p>
                        </button>
                    buttonSkill[3]=
                        <button className='leftBut' disabled>
                            <p className="buttonSkill">
                            </p>
                        </button>
                    buttonSkill[4]=
                        <button className='leftBut' disabled>
                            <p className="buttonSkill">
                            </p>
                        </button>
                }
            } else {
                buttonSkill[1]=
                    <button className='leftBut' disabled={this.props.Ani} onClick={()=>this.props.disharm()}>
                        <p className="buttonSkill">
                            ???????????????????????????~
                        </p>
                    </button>
                buttonSkill[2]=
                    <button className='rightBut' disabled>
                        <p className="buttonSkill">
                        </p>
                    </button>
                buttonSkill[3]=
                    <button className='leftBut' disabled>
                        <p className="buttonSkill">
                        </p>
                    </button>
                buttonSkill[4]=
                    <button className='leftBut' disabled>
                        <p className="buttonSkill">
                        </p>
                    </button>
            }
        }


        let attributeList={
            At:'??????',
            Sa:'??????',
            Df:'??????',
            Sd:'??????',
            Sp:'??????',
            Ht:'??????',
            Ms:'??????',
            paralysis:'??????',
            burn:'??????',
            block:'??????',
            flinch:'??????',
        }

        let hpCal1=10+220*(monster1.ability.aniHP/monster1.ability.maxHP);
        let hpColor1;
        let hpRadius1;

        let hpCal2=10+220*(monster2.ability.aniHP/monster2.ability.maxHP);
        let hpColor2;
        let hpRadius2;

        if(monster1.ability.aniHP/monster1.ability.maxHP<=0.25){
            hpColor1='red';
        } else {
            if(monster1.ability.aniHP/monster1.ability.maxHP<=0.5){
                hpColor1='rgba(255,192,0,1)';
            } else hpColor1='green';
        }

        if(monster2.ability.aniHP/monster2.ability.maxHP<=0.25){
            hpColor2='red';
        } else {
            if(monster2.ability.aniHP/monster2.ability.maxHP<=0.5){
                hpColor2='yellow';
            } else hpColor2='green';
        }

        hpRadius1=hpStream(hpCal1);
        hpRadius2=hpStream(hpCal2);

        

        let hpText={
            marginLeft: '13px',
            marginTop: '2px',
            border: '2.5px solid #8B5A00',
            paddingLeft: '0.5px',
            paddingTop:'0.5px',
            paddingBottom: '0.5px',
            width:'230px',
            height:'15px',
            backgroundColor: 'white',
            borderRadius: '10% / 100%',
        };

        let hpText1={
            display:'inlineBlock',
            backgroundColor: hpColor1,
            width: hpCal1+'px',
            height:'14.5px',
            margin:0,
            paidding:0,
            borderRadius: hpRadius1,
        };
        
        let hpText2={
            display:'inlineBlock',
            backgroundColor: hpColor2,
            width: hpCal2+'px',
            height:'14.5px',
            margin:0,
            paidding:0,
            borderRadius: hpRadius2,
        };

        let HPStream1=<div style={hpText}>
            <div style={hpText1}></div>
        </div>;

        let HPStream2=<div style={hpText}>
            <div style={hpText2}></div>
        </div>;

        let stateOption1=[];
        let stateOption2=[];
        

        for(let i in states1.attribute){     //????????????
            if(states1.attribute[i] > 0){
                stateOption1.push(<option key={i}>
                    {attributeList[i]}:??????{states1.attribute[i]}???
                </option>)
            } else 
                if(states1.attribute[i] < 0){
                    stateOption1.push(<option key={i}>
                        {attributeList[i]}:??????{-(states1.attribute[i])}???
                    </option>)
                }
        }
        for(let i in states1.abnormal){      //????????????
            if(states1.abnormal[i].checks && i!=='isOK'){
                stateOption1.push(<option key={i}>
                    {attributeList[i]}
                </option>)
            }
        }

        for(let i in states2.attribute){     //????????????
            if(states2.attribute[i] > 0){
                stateOption2.push(<option key={i}>
                    {attributeList[i]}:??????{states2.attribute[i]}???
                </option>)
            } else 
                if(states2.attribute[i] < 0){
                    stateOption2.push(<option key={i}>
                        {attributeList[i]}:??????{-(states2.attribute[i])}???
                    </option>)
                }
        }
        for(let i in states2.abnormal){      //????????????
            if(states2.abnormal[i].checks && i!=='isOK'){
                stateOption2.push(<option key={i}>
                    {attributeList[i]}
                </option>)
            }
        }

        return(
            <div id='box'>
                <div className="block"></div>
                <div className="middleBox">
                    <div id='playerMonster' className="middleDiv">
                        <div className='topBox'>
                            <p className="nameAndLV">
                            LV:{monster1.LV+'  '}{monster1.name+'  '}
                                <select id='states'>
                                    <option className="nameAndLV">?????????</option>
                                    {stateOption1}
                                </select>
                                <span>
                                {' '}HP:{Math.floor(monster1.ability.aniHP)}/{monster1.ability.maxHP}
                                </span>
                            </p>
                            {HPStream1}
                        </div>
                        <img src={pic1} alt='????????????' className="AVG"></img>
                    </div>
                    <div className="roundBox_00">
                        <h1 className="round">Round {this.props.round}</h1>
                    </div>
                    <div id='CPUMonster' className="middleDiv">
                    <div className='topBox'>
                            <p className="nameAndLV">
                            LV:{monster2.LV+'  '}{monster2.name+'  '}
                                <select id='states'>
                                    <option className="nameAndLV">?????????</option>
                                    {stateOption2}
                                </select>
                                <span>
                                {' '}HP:{Math.floor(monster2.ability.aniHP)}/{monster2.ability.maxHP}
                                </span>
                            </p>
                            {HPStream2}
                        </div>
                        <img src={pic2} alt='????????????' className="AVG"></img>
                    </div>
                </div>
                <div id='battleText'>
                    <div id='skillButton'>
                        <div id='skillRow'>
                            {buttonSkill[1]}
                            {buttonSkill[2]}
                        </div>
                        <div id='skillRow'>
                            {buttonSkill[3]}
                            {buttonSkill[4]}
                        </div>
                    </div>
                    <div id='textBox'>
                        <p id='message'>{this.props.message}</p>
                    </div>
                </div>
            </div>
        );
    }

}