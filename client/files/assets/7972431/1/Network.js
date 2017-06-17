var client = client || function() {
        this.socket = null;

        this.me = null;
        this.rooms = [];
        this.players = [];
        this.room = null;
        this.tutorialDone = false;

        /**
         * Connect to websocket and save socket
         */
        this.connect = function() {
            if(this.socket !== null) {
                //Reconnect
                this.socket.connect();
            } else {
                //Connect for first time
                this.socket = io.connect(game.config.socket.host);

                this.bindEventListeners();
            }
        };

        /**
         * Join lobby
         */
        this.joinLobby = function() {
            this.socket.emit('join-lobby');
        };

        /**
         * Choose name
         */
        this.chooseName = function(playerName) {
            if(typeof playerName !== "undefined") {
                this.socket.emit('choose-name', {
                    data: {
                        playerName: playerName
                    }
                });
            } else {
                console.log('"choose-name": Player name must be provided');
            }
        };

        /**
         * Choose character
         */
        this.chooseCharacter = function(playerCharacter) {
            if(typeof playerCharacter !== "undefined") {
                this.socket.emit('choose-character', {
                    data: {
                        playerCharacter: playerCharacter
                    }
                });
            } else {
                console.log('"choose-character": Character name must be provided');
            }
        };

        /**
         * Create room
         */
        this.createRoom = function(roomName) {
            if(typeof roomName !== "undefined") {
                this.socket.emit('create-room', {
                    data: {
                        roomName: roomName
                    }
                });
            } else {
                console.log('"create-room": Room name must be provided.');
            }
        };

        /**
         * Join room
         */
        this.joinRoom = function(roomName) {
            if(typeof roomName !== "undefined") {
                this.socket.emit('join-room', {
                    data: {
                        roomName: roomName,
                        random: false
                    }
                });
            } else {
                console.log('"join-room": Room name must be provided.');
            }
        };

        /**
         * Join random room
         */
        this.joinRandomRoom = function() {
            this.socket.emit('join-room', {
                data: {
                    random: true
                }
            });
        };

        /**
         * Leave room
         */
        this.leaveRoom = function(roomName) {
            if(typeof roomName !== "undefined") {
                this.socket.emit('leave-room', {
                    data: {
                        roomName: roomName
                    }
                });
            } else {
                console.log('"leave-room": Room name must be provided.');
            }
        };

        /**
         * Change map
         */
        this.changeMap = function(roomName, mapName) {
            if(typeof roomName !== "undefined" && typeof mapName !== "undefined") {
                this.socket.emit('change-map', {
                    data: {
                        roomName: roomName,
                        mapName: mapName
                    }
                });
            } else {
                console.log('"change-map": Room name and map name must be provided.');
            }
        };

        /**
         * Change mode
         */
        this.changeMode = function(roomName, modeName) {
            if(typeof roomName !== "undefined" && typeof modeName !== "undefined") {
                this.socket.emit('change-mode', {
                    data: {
                        roomName: roomName,
                        modeName: modeName
                    }
                });
            } else {
                console.log('"change-mode": Room name and mode name must be provided.');
            }
        };
    
        /**
         * Update game time
         */
        this.updateGameTime = function(roomName, action) {
            if(typeof roomName !== "undefined" && typeof action !== "undefined") {
                this.socket.emit('update-game-time', {
                    data: {
                        roomName: roomName,
                        action: action
                    }
                });
            } else {
                console.log('"update-game-time": Action must be provided.');
            }
        };

        /**
         * Start game
         */
        this.startGame = function(roomName) {
            if(typeof roomName !== "undefined") {
                this.socket.emit('start-game', {
                    data: {
                        roomName: roomName
                    }
                });
            } else {
                console.log('"start-game": Room name must be provided.');
            }
        };
    
        /**
         * Start timer
         */
        this.startTimer = function(roomName) {
            var self = this;
            
          if(typeof self.room.name !== "undefined") {
                this.socket.emit('start-timer', {
                    data: {
                        roomName: self.room.name
                    }
                });
            } else {
                console.log('"start-timer": Room name must be provided.');
            }
        };

        /**
         * Move player
         */
        this.movePlayer = function(location, rotation) {
            var self = this;

            if(this.room !== null) {
                this.socket.emit('move-player', {
                    data: {
                        roomName: self.room.name,
                        x: location.x,
                        y: location.y,
                        z: location.z,
                        rotX: rotation.x,
                        rotY: rotation.y,
                        rotZ: rotation.z
                    }
                });
            }
        };
    
        /**
         * Take damage
         */
        this.takeDamage = function(playerId) {
            var self = this;
            
            if(this.room !== null) {
                this.socket.emit('take-damage', {
                   data: {
                       roomName: self.room.name,
                       targetPlayerId: playerId
                   } 
                });
            }
        };

        /**
         * Disconnect from websocket
         */
        this.disconnect = function() {
            //Close socket connection
            this.socket.disconnect();
        };

        /**
         * Bind event listeners
         */
        this.bindEventListeners = function() {
            if(this.socket !== null) {
                this.socket.on('disconnect', this.onDisconnect);
                this.socket.on('connect', this.onConnect);
                this.socket.on('error', this.onError);
                this.socket.on('connect_failed', this.onConnectFailed);
                this.socket.on('lobby-joined', this.onLobbyJoined);
                this.socket.on('name-chosen', this.onNameChosen);
                this.socket.on('character-chosen', this.onCharacterChosen);
                this.socket.on('room-created', this.onRoomCreated);
                this.socket.on('room-joined', this.onRoomJoined);
                this.socket.on('room-left', this.onRoomLeft);
                this.socket.on('game-started', this.onGameStarted);
                this.socket.on('timer-started', this.onTimerStarted);
                this.socket.on('timer-update', this.onTimerUpdate);
                this.socket.on('game-ended', this.onGameEnded);
                this.socket.on('game-reset', this.onGameReset);
                this.socket.on('map-changed', this.onMapChanged);
                this.socket.on('mode-changed', this.onModeChanged);
                this.socket.on('game-time-updated', this.onGameTimeUpdated);
                this.socket.on('player-moved', this.onPlayerMoved);
                this.socket.on('took-damage', this.onTookDamage);
            } else {
                console.error("Couldn't bind socket event listeners. Socket is " + typeof this.socket);
            }
        };

        /**
         * onConnect
         */
        this.onConnect = function() {
            console.log('Connected to gameserver');
        };

        /**
         * onError
         */
        this.onError = function(payload) {
            console.log('Error during connection to gameserver', payload);
        };

        /**
         * onConnectFailed
         */
        this.onConnectFailed = function(payload) {
            console.log('Connection to gameserver failed', payload);
        };

        /**
         * onLobbyJoined
         */
        this.onLobbyJoined = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Console
                    console.info('You joined the lobby.');

                    //Update client data
                    game.client.me = payload.data.me;
                    game.client.players = payload.data.players;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:you-joined', game.client.me, game.client.rooms, game.client.players);
                }
                else if(payload.target === 'other') {
                    //Console
                    console.info('Someone joined the lobby.');

                    //Update client data
                    game.client.players = payload.data.players;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-joined', game.client.rooms, game.client.players);
                }

            } else {
                //Console
                console.log('Error joining lobby');
            }
        };

        /**
         * onNameChosen
         */
        this.onNameChosen = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Console
                    console.info('You changed your name.');

                    //Update client data
                    game.client.me = payload.data.me;

                    //Fire game events
                    pc.app.fire('lobby:name-chosen', game.client.me.name);
                }
            } else {
                //Console
                console.log('Error during name change');
            }
        };

        /**
         * onCharacterChosen
         */
        this.onCharacterChosen = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Console
                    console.info('You changed your character.');

                    //Update self
                    game.client.me = payload.data.me;

                    //Fire game events
                    pc.app.fire('lobby:character-chosen', game.client.me.character);
                }
            } else {
                //Console
                console.log('Error during character change');
            }
        };

        /**
         * onRoomCreated
         */
        this.onRoomCreated = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Console
                    console.info('You created a room.');

                    //Update client data
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:you-created-a-room', game.client.room, game.client.rooms);

                }
                else if(payload.target === 'other') {
                    //Update client data
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-created-a-room', game.client.rooms);
                }
            } else {
                //Console
                console.log('Error during room creation');
                console.log(payload.message);
            }
        };

        /**
         * onRoomJoined
         */
        this.onRoomJoined = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.log(payload.data.newPlayer.name + ' joined your room.');

                    //Update client data
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('room:someone-joined-your-room', game.client.room, game.client.rooms);
                }
                else if(payload.target === 'other') {
                    //Console
                    console.log('Someone joined a room');

                    //Update client data
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-joined-a-room', game.client.rooms);
                }
            } else {
                console.log('Error joining room');
                console.log(payload.message);
            }
        };

        /**
         * onRoomLeft
         */
        this.onRoomLeft = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.log(payload.data.leavingPlayer.name + ' left your room.');

                    //Update client data
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-left-your-room', game.client.room, game.client.rooms);
                    pc.app.fire('game:someone-left', payload.data.leavingPlayer);
                }
                else if(payload.target === 'me') {
                    //Console
                    console.log('You left a room');

                    //Update client data
                    game.client.room = null;
                    game.client.tutorialDone = false;
                    game.client.rooms = payload.data.rooms;

                    game.client.joinLobby();

                    //Fire game events
                    pc.app.fire('lobby:you-left-a-room', game.client.rooms);
                }
            } else {
                //Console
                console.log('Error leaving room.');
                console.log(payload.message);
            }
        };

        /**
         * onMapChanged
         */
        this.onMapChanged = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Changed map.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:map-changed', game.client.room);
                }
            } else {
                //Console
                console.log('Error changing map.');
                console.log(payload.message);
            }
        };

        /**
         * React on mode changed
         */
        this.onModeChanged = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Changed mode.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:mode-changed', game.client.room);
                }
            } else {
                //Console
                console.log('Error changing mode.');
                console.log(payload.message);
            }
        };
    
         /**
         * React on game time updated
         */
        this.onGameTimeUpdated = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Changed game time.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:game-time-updated', game.client.room);
                }
            } else {
                //Console
                console.log('Error changing gaming time.');
                console.log(payload.message);
            }
        };

        /**
         * onGameStarted
         */
        this.onGameStarted = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Your game started.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:your-game-started', game.client.room);
                }
                else if(payload.target === 'other') {
                    //Console
                    console.info('Someone started a game.');

                    //Update self
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someones-game-started', game.client.rooms);
                }

            } else {
                //Console
                console.info('Error starting game.');
                console.log(payload.message);
            }
        };
    
        /**
         * onTimerStarted
         */
        this.onTimerStarted = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Your game timer started');

                    //Fire game events
                    pc.app.fire('room:your-timer-started', payload.data.secondsLeft);
                }
            }
            else {
                console.info('Error starting game timer.');
            }
        };
    
        /**
         * onTimerUpdate
         */
        this.onTimerUpdate = function(payload) {
          if(payload.state === 'success') {
              if(payload.target === 'room') {
                  //Fire game events
                  pc.app.fire('room:your-timer-updated', payload.data.secondsLeft);
              }
          }  
            else {
                console.log('Error updating game timer.');
            }
        };
    
        /**
         * onGameEnded
         */
        this.onGameEnded = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Your game ended');
                    
                    //Fire game events
                    pc.app.fire('room:your-game-ended', payload.data.podium);
                    pc.app.fire('game:game-ended');
                }
            }
            else {
                console.info('Error ending game.');
            }
        };
    
        /**
         * onGameReset
         */
        this.onGameReset = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Console
                    console.info('Your game was reset');
                    
                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                }
                else if(payload.target === 'other') {
                    //Console
                    console.info('A game was reset');
                    
                    //Update self
                    game.client.rooms = payload.data.rooms;
                    
                    pc.app.fire('lobby:someones-game-reset', game.client.rooms);
                }
            }
            else {
                console.info('Error reseting game.');
            }
        };

        /**
         * onPlayerMoved
         */
        this.onPlayerMoved = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Skip if it's myself that moved
                    if(payload.data.player.id === game.client.me.id) return;

                    //Fire game events
                    pc.app.fire('game:player-moved', payload.data.player);
                }
            }
            else {
                //Console
                console.info('Error moving player.');
            }
        };
    
        /**
         * onPlayerDamaged
         */
        this.onTookDamage = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {   
                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    
                    //Fire game events
                    pc.app.fire('game:player-damaged', game.client.room, payload.data.playerThatDied);
                }
            }
            else {
                //Console
                console.info('Error damaging player.');
            }
        };
    };

/**
 * Construct Client
 */
game.client = new client();