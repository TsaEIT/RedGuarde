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
        this.addChild(new game.HUD.KeyItem(5, 5));
        this.addChild(new game.HUD.Message(0, 5));
    }
});

game.HUD.KeyItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.lives = -1;
        
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 0.35);
        
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.lives !== game.data.lives) {
            this.lives = game.data.lives;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        this.font.draw (context, game.data.lives, me.game.viewport.width + this.pos.x - 2, me.game.viewport.height + this.pos.y - 2);
    }

});

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
        
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 0.3);
        
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
        this.font.draw (context, game.data.message, me.game.viewport.width + this.pos.x - 60, me.game.viewport.height + this.pos.y - 2);
    }

});