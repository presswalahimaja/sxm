/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function EventsAdminCtrl($http, API, auth, GeneralService, ngDialog) {
    "ngInject";
    
    var self = this;
    // Mock data array
    self.data = {
        sport:"Cricket",
        dt:"Mar 12, 2017, 11:00 AM",
        venue:" GSFC Sports complex, Vadodara",
        totalovers:10,
        status:"start",
        tossStatus:"",
        team:[{
            teamid:"NZ",
            name:"New Zealand",
            inning:true,
            players:[
                {
                    id:"1",
                    status:"batting", // out,batting,pending
                    detail:"batting",
                    name:"N. Player 1",
                    runs:[],
                    overs:[{overNum:0,runPerball:[1,4,2,1,0,0]}]
                },{
                    id:"2",
                    status:"batting", // out,batting,pending
                    detail:"batting",
                    name:"N. Player 2",
                    runs:[],
                    overs:[{overNum:0,runPerball:[1,4,2,1,0,0]}]
                },{
                    id:"3",
                    status:"pending", // out,batting,pending
                    detail:"batting",
                    name:"N. Player 3",
                    runs:[],
                    overs:[{overNum:0,runPerball:[1,4,2,1,0,0]}]
                }
            ]
        },{
            teamid:"SA",
            name:"South Africa",
            inning:false,
            curInning:0,
            players:[
                {
                    id:"1",
                    status:"out", // out,batting,pending
                    detail:"c. Jignesh b. Arpit",
                    name:"S. Player 1",
                    runs:[],
                    overs:[]
                },{
                    id:"2",
                    status:"batting", // out,batting,pending
                    detail:"batting",
                    name:"Jignesh",
                    runs:[],
                    overs:[]
                },{
                    id:"3",
                    status:"batting", // out,batting,pending
                    detail:"batting",
                    name:"S. Player 3",
                    runs:[],
                    overs:[]
                }
            ]
        }]
    };
    // Scorecard functions
    // batting status
    self.isPlayerLive = function (item) { 
        return item.status !== 'pending';
    };
    // Total runs
    var totalPlayerRuns = function(obj){
        var runsTotal = 0;
        for(var i=0;i < obj.runs.length;i++){
            if(obj.runs[i] != "" && obj.runs[i] != "out")
                runsTotal = runsTotal + parseInt(obj.runs[i]);
            else if(obj.runs[i] == "out"){
                obj.status = "out";
                obj.detail = "c & b. Jignesh";
            }
        }
        return runsTotal;
    }
    // balls faced
    var ballFacedByPlayers = function(obj){
        var balls = 0;
        for(var i=0;i < obj.length;i++){
            if(obj[i] != "")
                balls++;
        }
        return balls;
    }
    // Player statistic
    self.playerStat = function(_str, pObj){
        var obj = pObj.runs;
        // Runs
        if(_str == 'run'){
            return totalPlayerRuns(pObj);
        }
        // Balls
        if(_str == 'balls'){
            return ballFacedByPlayers(obj);
        }
        // Fours
        if(_str == 'four'){
            var _fours = 0;
            for(var i=0;i < obj.length;i++){
                if(obj[i] != "" && parseInt(obj[i]) == 4)
                    _fours++;
            }
            return _fours;
        }
        // Fours
        if(_str == 'six'){
            var _sixes = 0;
            for(var i=0;i < obj.length;i++){
                if(obj[i] != "" && parseInt(obj[i]) == 6)
                    _sixes++;
            }
            return _sixes;
        }
        // Strike rate
        if(_str == 'sr'){
            var sr = ((totalPlayerRuns(pObj)*100)/ballFacedByPlayers(obj)).toFixed(2);
            if(isNaN(sr)){
                sr = 0;
            }
            return sr;
        }
    };
    // Add run box
    self.addRunBox = function (item) {
        if(item[item.length - 1] != "" && item[item.length - 1] != "out"){
            return item.push("");
        }
    };
    // Total balls of overs
    self.currentOverBall = function(bowlObj){
        var ballCount = 1;
        for(var i = 0; i < bowlObj.runPerball.length; i++){
            if(bowlObj.runPerball[i] != "")
                ballCount++;
        }
        return ballCount;
    }
    self.addBallBox = function(bowlObj){
        ballCount = self.currentOverBall(bowlObj);
        var lastElem = bowlObj.runPerball.length - 1;
        if(bowlObj.runPerball.length > 0 && bowlObj.runPerball[bowlObj.runPerball.length - 1] != ""){
            if(ballCount <= 6){
                bowlObj.runPerball.push("");
            }
        }else if(bowlObj.runPerball.length == 0){
            bowlObj.runPerball.push("");
        }
    }
    // Add overs
    self.addNewOvers = function(num){
        if(self.playername != ""){
            for(var i = 0; i < self.data.team[num].players.length; i++){
                if(self.data.team[num].players[i].name == self.playername){
                    self.data.team[num].players[i].overs.push({overNum:self.getOverIndex(num),runPerball:[]});
                }
            }
        }
    }
    // Get over numbers
    self.getOverIndex = function(num){
        var finalNum = 1;
        for(var i = 0; i < self.data.team[num].players.length; i++){
            for(var j = 0; j < self.data.team[num].players[i].overs.length; j++){
                finalNum++;
            }
        }
        return finalNum;
    }
    // Number of fall wickets
    self.fallOfWickets = function(_inning){
        var totalWkts = 0;
        for(var i=0; i < self.data.team[_inning].players.length;i++){
            if(self.data.team[_inning].players[i].status == "out"){
                totalWkts++;
            }
        }
        return totalWkts;
    }
    // Total Overs
    // Number of fall wickets
    self.totalInningsOvers = function(_inning){
        var totalOvers = 0;
        var getObj = self.data.team[_inning].players;
        for(var i=0; i < getObj.length;i++){
            for(var j=0; j < getObj[i].overs.length;j++){
                if(getObj[i].overs[j].runPerball != undefined){
                    var sixball = 0;
                    for(var k=0; k < getObj[i].overs[j].runPerball.length;k++){
                        if(getObj[i].overs[j].runPerball[k] != "")
                            sixball++;
                    }
                    if(sixball == 6)
                        totalOvers++;
                    else
                        totalOvers = totalOvers + (sixball/10);
                }
            }
        }
        return totalOvers;
    }
    // Innings run
    self.totalInningsRun = function(_inning){
        var totalRuns = 0;
        var getObj = self.data.team[_inning].players;
        for(var i=0; i < getObj.length;i++){
            for(var j=0; j < getObj[i].overs.length;j++){
                if(getObj[i].overs[j].runPerball != undefined){
                    for(var k=0; k < getObj[i].overs[j].runPerball.length;k++){
                        if(getObj[i].overs[j].runPerball[k] != "" && getObj[i].overs[j].runPerball[k] != "wk"){
                            totalRuns += parseInt(getObj[i].overs[j].runPerball[k]);
                        }
                    }
                }
            }
        }
        return totalRuns;
    }
};
angular.module('sem')
        .controller('CricketMaster',EventsAdminCtrl);