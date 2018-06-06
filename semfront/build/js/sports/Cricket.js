function Scorecard(eid, id) {
    this.eid = eid; // event id
    this.scid = id; // scorecard id
    this.innings = []; // innings array

    // add new innings
    this.setInning = function (position, team) {
        /*switch (position) {
         case 1:
         this.inning1 = team;
         break;
         case 2:
         this.inning2 = team;
         break;
         case 3:
         this.inning3 = team;
         break;
         case 4:
         this.inning4 = team;
         break;
         }*/
        this.innings[position] = team;
    };
}
;
function Team(id, name) {
    self = this;
    this.trace = [];
    this.id = id; //team group id
    this.name = name; // team group name
    this.score = 0;
    this.overs = 0; // total overs bowled
    this.balls = 0; // total balls bowled
    this.overMap = [];
    this.currOver = [];
    this.FOW = [];
    this.W = 0;
    this.extras = {
        runs: 0,
        b: 0,
        lb: 0,
        wd: 0,
        nb: 0,
        p: 0
    };
    this.addTrace = function(obj){
        this.trace.push(obj);
    };
    this.setTeam = function (obj) {
        this.trace = obj.trace;
        this.score = obj.score;
        this.overs = obj.overs; // total overs bowled
        this.balls = obj.balls; // total balls bowled
        this.overMap = obj.overMap;
        this.currOver = obj.currOver;
        this.FOW = obj.FOW;
        this.W = obj.W;
        this.extras = obj.extras;
    };

    this.batting = []; // new batsman objects
    this.bowling = []; // new bowler objects

    //add new batsman
    this.addBatsman = function (id, name) {
        var revive = false;
        for(var i=0;i < this.batting.length;i++){
            if(this.batting[i].id == id){
                revive = true;
                this.batting[i].outObj = null;
                this.batting[i].batting = true;
            }
        }
        if(revive){
            
        }else {
            var newBatsman = new Batsman(id, name, new Date().getTime());
            this.batting.push(newBatsman);
        }
        
    };
    this.addBowler = function (id, name) {
        this.bowling.push(new Bowler(id, name));
    };
    this.addRuns = function (runs) {
        this.score += runs;
        //this.currOver.push(runs);
        this.addBall();
    };
    this.removeRuns = function (runs, mix) {
        this.score -= runs;
        //this.currOver.push(runs);
        if (mix !== "NB") {
            this.removeBall();
        }
    };

    this.addBall = function () {
        this.balls += 1;
        if (this.balls === 6) {
            this.overs += 1;
            this.balls = 0;
            this.overMap.push(this.currOver);
            this.currOver = [];
        }
    };
    this.removeBall = function () {
        if (this.balls === 0) {
            if (this.overs > 0) {
                this.overs -= 1;
                this.balls = 5;
            }
        } else {
            this.balls -= 1; // remove ball
        }
    };
    this.addWicket = function (batsman) {
        this.FOW.push({"at": this.score, "overs":this.overs + "." + this.balls,"batsman": {id: batsman.id, name: batsman.name}});
        this.W += 1;
    };
    this.addExtra = function (runs, type, mix) {
        this.score += runs;
        if (type === "WD" || type === "NB") {
            this.extras.runs += 1;
            this.score += 1;
        }
        if (type === 'WD') {
            this.extras.runs += runs;
            this.extras.wd += runs + 1;
        }
        if (type === "NB") {
            //this.extras.runs += 1;
            this.extras.nb += 1;
        }
        if (type === "LB") {
            this.extras.runs += runs;
            this.extras.lb += runs;
            if (mix != "NB") { // dont add ball if this is on no ball LB
                this.addBall();
            }
        }
        if (type === "BY") {
            this.extras.runs += runs;
            this.extras.b += runs;
            if (mix != "NB") { // dont add ball if this is on no ball
                this.addBall();
            }
        }
        if (type === "PT") {
            this.extras.runs += runs;
            this.extras.p += runs;
        }
    };
}
;
function Bowler(id, name) {
    this.id = id;
    this.name = name;
    this.over_count = 0;
    this.balls = 0;
    this.overMap = [];
    this.currOver = [];
    this.runs = 0;
    this.maiden = 0;
    this.wicket = 0;
    this.NB = 0;
    this.WD = 0;
    this.Eco = 0.0;
    this.CM = 1; //count Maiden

    this.setBowler = function (obj) {
        this.over_count = obj.over_count;
        this.balls = obj.balls;
        this.overMap = obj.overMap;
        this.currOver = obj.currOver;
        this.runs = obj.runs;
        this.maiden = obj.maiden;
        this.wicket = obj.wicket;
        this.NB = obj.NB;
        this.WD = obj.WD;
        this.Eco = obj.Eco;
    };

    this.addBowl = function (run, type) { // run: number of runs, extras: extra runs, type: type of extra (WD, NB), wicket
       if(angular.isUndefinedOrNull(type)){
          type = "";
       }
       this.currOver.push("" + run  + type);
       if (type !== "LB" && type !== "BY") {
            this.runs += run; // add runs
            if (run > 0) {
                this.CM = 0;
            }
        }
        if (type !== "WD" && type !== "NB") {
            this.balls += 1; // add ball
            //this.currOver.push(run);
            if (this.balls === 6) {
               if(this.isMaiden(this.currOver)){
                  this.maiden += 1;
               };
                this.over_count += 1;
                this.balls = 0;
                this.overMap.push(this.currOver);
                this.currOver = [];
               //this.maiden += this.CM;
                this.CM = 1;
            }
        }
        // add extras
        if (type === 'WD') {
            this.WD += (run + 1);
            this.runs += 1;
            this.CM = 0;
        }
        if (type === "NB") {
            this.NB += 1;
            this.runs += 1;
            this.CM = 0;
        }

        var blsp = 1 / 6 * this.balls;
        if (this.over_count === 0 && blsp === 0) {
            this.Eco = 0;
        } else {
            this.Eco = this.runs / (this.over_count + blsp); // calculate economy
            this.Eco = Math.round(this.Eco * 100) / 100;
        }
    };

    this.removeBall = function (run, type, mix) {
        if (type !== "NB" && type != "WD" && mix !== "NB" && type !== "WD") {
            if (this.over_count === 0 && this.balls === 0) {
                console.log("nothing to revert for " + this.name);
                return false;
            }
        }
        if (type !== "LB" && type !== "BY") {
            this.runs -= run; // remove runs
        }
        if (type !== "WD" && type !== "NB" && mix !== "NB") {

            //this.currOver.push(run);
            if (this.balls === 0) {
                if (this.over_count > 0) {
                    this.over_count -= 1;
                    this.balls = 5;
                }
                this.currOver = this.overMap.pop();
            } else {
                this.balls -= 1; // remove ball
            }
                    // remove maiden
        if(this.currOver.length === 6) {
           if(this.isMaiden(this.currOver)){
               this.maiden -= 1;
           }     
        }
            this.currOver.pop();
        }
        // add extras
        if (type === 'WD') {
            this.WD -= (run + 1);
            this.runs -= 1;
        }
        if (type === "NB" || mix === "NB") {
            this.NB -= 1;
            this.runs -= 1;
        }

        var blsp = 1 / 6 * this.balls;
        if (this.over_count === 0 && blsp === 0) {
            this.Eco = 0;
        } else {
            this.Eco = this.runs / (this.over_count + blsp); // calculate economy
            this.Eco = Math.round(this.Eco * 100) / 100;
        }
    };
    this.isMaiden = function(currOver) {
       var isMaiden = true;
       for (var i = 0; i < currOver.length; i++){
          if(currOver[i] != "0" && (currOver[i].search('LB') == -1) && (currOver[i].search('BY') == -1)){
            isMaiden = false;
            break;
          }
       }
       return isMaiden;
    };
    this.addWicket = function () {
        this.wicket += 1;
    };
    //replace over with new values
    function replaceOver(overObj, bowlerID, position) {
        recalculateAll(); //trigger recalculate function if over is being updated. 
    }
}
;
function Batsman(id, name, it) {
    this.id = id;
    this.name = name;
    this.inT = it;
    this.outT;
    this.runs = [];
    this.balls = 0;
    this.four = 0;
    this.sixes = 0;
    this.total = 0;
    this.SR = 0;
    this.batting = true;
    this.outObj = null;

    this.setBatsman = function (obj) {
        this.inT = obj.inT;
        this.outT = obj.outT;
        this.runs = obj.runs;
        this.balls = obj.balls;
        this.four = obj.four;
        this.sixes = obj.sixes;
        this.total = obj.total;
        this.SR = obj.SR;
        this.batting = obj.batting;
        this.outObj = obj.outObj;
    };

    this.addRuns = function (runs, OT) {
        this.runs.push(runs); // add runs per ball
        this.total += runs; // add to total
        this.balls += 1; //add number of balls played;
        this.SR = ((this.total * 100) / this.balls).toFixed(2);
        if (isNaN(this.SR)) {
            this.SR = 0;
        }
        // add fours and sixes
        if (runs === 4 && OT !== true) {
            this.four += 1;
        }
        if (runs === 6 && OT !== true) {
            this.sixes += 1;
        }
    };
    this.removeRuns = function (runs, mix) {
        this.runs.pop();
        this.total -= runs;
        this.balls -= 1;
        this.SR = ((this.total * 100) / this.balls).toFixed(2);
        if (isNaN(this.SR)) {
            this.SR = 0;
        }
        // add fours and sixes
        if (runs === 4 && mix !=="OT") {
            this.four -= 1;
        }
        if (runs === 6 && mix !=="OT") {
            this.sixes -= 1;
        }
    };

    // got em
    this.out = function (type, bowler, fielder) {
        //add balls if bowled, catc etc. in run out runs can be added
        this.outObj = outFunc(type, bowler, fielder);
        this.outT = new Date().getTime();
        this.batting = false;
    };
}
;
function outFunc(type, bowler, fielder) {
    var outObj = {};
    outObj.type = type;//B,CF,CB, CW, ST, RO, HW, HH, OF, TO,LB,HB,RO,RT
    // ways where fielder is involved
    if (type === "CF" || type === "RO" || type === "ST") {
        outObj.fielder = {
            id: fielder.id,
            name: fielder.name
        };
    }
    // ways where bowler is involved. 
    if (type !== 'RO' || type !== 'TO' || type !== 'RT') {
        outObj.bowler = {
            id: bowler.id,
            name: bowler.name
        };
    }
    return outObj;
}
;