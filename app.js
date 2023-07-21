let expressServer = require("express");
let cricketTeam = expressServer();
let { open } = require("sqlite");
let connectDb = require("sqlite3");

let path = require("path");
let filePath = path.join(__dirname, "cricketTeam.db");

cricketTeam.use(expressServer.json());

let dbObj = null;
let connectDbAndStartServer = async () => {
    try{
        dbObj = await open({
                        filename: filePath,
                        driver: connectDb.Database
        });
        cricketTeam.listen(3000, () => {
            console.log("Server Starting at http://localhost:3000/");
        });
    }
    catch(errObj){
        console.log(errObj.message);
        process.exit(1);
    }

}

connectDbAndStartServer();


//Get Players of Team
cricketTeam.get("/players/", async (req, res) => {
    let getPlayersQuery = `SELECT * FROM cricket_team`;
    let players = await dbObj.all(getPlayersQuery);    
    res.send(players);
});


//Add Player To Team
cricketTeam.post("/players/", async(req, res) => {
    let {playerName, jerseyNumber, role} = req.body;
    let createPLayerQuery = `INSERT INTO cricket_team (player_name, jersey_number, role) VALUES('${playerName}', ${jerseyNumber}, '${role}')`;
    await dbObj.run(createPLayerQuery);
    res.send("Player Added to Team");     
});


//Get Player Details API
cricketTeam.get("/players/:playerID/", async (req, res) => {
    let {playerID} = req.params;
    let getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerID}`;
    let playerDetails = await dbObj.get(getPlayerQuery);      
    res.send(playerDetails);
});



//Update Player API
cricketTeam.put("/players/:playerID/", async (req, res) => {
    let {playerID} = req.params;
    let {playerName, jerseyNumber, role} = req.body;
    let updateDetailsQuery = `UPDATE cricket_team SET player_name = '${playerName}', jersey_number = ${jerseyNumber}, role = '${role}' WHERE player_id = ${playerID}`;
    await dbObj.run(updateDetailsQuery);
    res.send("Player Details Updated");    
});


//Delete Player API
cricketTeam.delete("/players/:playerID/", async (req, res) => {
    let {playerID} = req.params;
    let deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerID}`;
    await dbObj.run(deletePlayerQuery);
    res.send("Player Removed");
});


module.exports = cricketTeam;