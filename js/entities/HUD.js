/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new heart3(227, 14)); // 179
        this.addChild(new heart2(201, 14));
        this.addChild(new heart1(175, 14));
        this.addChild(new game.HUD.Message(0, 5));
    }
});

// create a basic GUI Object
var heart3 = me.GUI_Object.extend( {
   init:function (x, y, settings)
   {
      this.x_loc = x;
      this.y_loc = y;
      var settings = {}
      settings.image = "heart.png"
      settings.framewidth = settings["framewidth"]; // 22
      settings.frameheight = settings["framehight"]; // 14
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   },
   
   update:function() {
       if (game.data.lives >= 3) {
           this.alpha = 1;
       } else {
           this.alpha = 0;
       }
   }
} );

// create a basic GUI Object
var heart2 = me.GUI_Object.extend( {
   init:function (x, y, settings)
   {
      this.x_loc = x;
      this.y_loc = y;
      var settings = {}
      settings.image = "heart.png"
      settings.framewidth = settings["framewidth"]; // 22
      settings.frameheight = settings["framehight"]; // 14
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   },
   
   update:function() {
       if (game.data.lives >= 2) {
           this.alpha = 1;
       } else {
           this.alpha = 0;
       }
   }
} );

// create a basic GUI Object
var heart1 = me.GUI_Object.extend( {
   init:function (x, y, settings)
   {
      this.x_loc = x;
      this.y_loc = y;
      var settings = {}
      settings.image = "heart.png"
      settings.framewidth = settings["framewidth"]; // 22
      settings.frameheight = settings["framehight"]; // 14
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   },
   
   update:function() {
       if (game.data.lives >= 1) {
           this.alpha = 1;
       } else {
           this.alpha = 0;
       }
   }
} );


/*
game.HUD.KeyItem = me.Renderable.extend({
    
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.lives = -1;
        
        this.font = new me.BitmapFont(me.loader.getBinary('font'), me.loader.getImage('font'), 4);
        
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

    },
 : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.lives !== game.data.lives) {
            this.lives = game.data.lives;
            return true;
        }
        return false;
    },
    // Draw Score
    draw : function (context) {
        this.font.draw (context, game.data.lives, me.game.viewport.width + this.pos.x - 2, me.game.viewport.height + this.pos.y - 12);
    }

});
*/
game.HUD.Message = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the message
        this.message = "♀";
        
        this.font = new me.BitmapFont(me.loader.getBinary('font'), me.loader.getImage('font'), 2);
        
        this.font.textAlign = "center";
        this.font.textBaseline = "bottom";

    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.message !== game.data.message) {
            this.message = game.data.message;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        this.font.draw (context, game.data.message, me.game.viewport.width + this.pos.x - 130, me.game.viewport.height + this.pos.y - 2);
    }

});