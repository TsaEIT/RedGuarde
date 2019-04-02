var game = {
    "whatever": function() {
        console.log("Whatever!");
    },
    
    // an object where to store game information
    data : {
        // score
        score : 0,
        keys: 0,
        frozen: false,
        lives: 3,
        flag: false,
        wait_for_reload: false,
        message: "",
        gui : {
            inventory_button_visible: false
        },
		player_dir: "u"
    },
    
    "post_message": function(message) {
        game.data.message = message;
        setTimeout(function(){game.data.message = ""}, 3000);
    },
    
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(240, 192, {wrapper : "screen", scale : "auto", scaleMethod : "fit"})) {
            alert("Sorry, it seems your browser can't run the game.\nTry updating your browser.");
            return;
        }

        // Initialize the audio.
        // Remove .ogg file format later, may increase loading speed.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
        
        me.sys.gravity = 0;
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // Register entities
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("KeyEntity", game.KeyEntity);
        me.pool.register("unhideEntity", game.unhideEntity);
        me.pool.register("doorEntity", game.doorEntity);
        me.pool.register("vampireEntity", game.vampireEntity);
        me.pool.register("stopEntity", game.stopEntity);
        me.pool.register("skelespiderEntity", game.skelespiderEntity);
        me.pool.register("spikesEntity", game.spikesEntity);
        me.pool.register("cutSceneEntity", game.CutSceneEntity);
        
        
        // keyboard stuff
        me.input.bindKey(me.input.KEY.UP,  "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        
        me.input.bindKey(me.input.KEY.W,  "up");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.A,  "left");
        me.input.bindKey(me.input.KEY.D, "right");
        
        me.input.bindKey(me.input.KEY.I, "inventory"); // Can replace w/ E
        
        // Start the game.
        me.state.change(me.state.MENU);
    }
};
