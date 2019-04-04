game.inventory = game.inventory || {};


game.inventory.Container = me.Container.extend({
    init: function() {
        this.visible_stage = 0;
        
        this.last_key_press = false;
        this.visible = false;
        
		this.last_key_press = false;
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "inventory";
        
        this.visible_image;
        
        // change to play state on press Enter or click/tap
        /*
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                // play something on tap / enter
                // this will unlock audio on mobile devices
                // me.audio.play("cling");
                me.state.change(me.state.PLAY);
            }
        });
        
        // add the object at pos (10,10)
        this.addChild(this.children[0]);
        this.children[0].alpha = 0;
        */
    },
    
    update : function() {
        if (me.input.isKeyPressed('escape')) {
            if (this.visible_stage )
            console.log('escape')
            this.visible_stage = 0;
            if (this.visible_image != null) {
                this.removeChild(this.visible_image);
            }
            this.visible_image = null;
        }
        if (me.input.isKeyPressed('instruction')) {
            game.data.instructions_viewed = true;
           if (!this.last_key_press) {
               console.log("test");
               this.visible_stage += 1;
               console.log(this.visible_stage);
               switch(this.visible_stage) {
                   case 0:
                        this.visible_image = null;
                        break;
                   case 1:
                        this.visible_image = new gui_img("tutorial_1.png", 120, 96, { // background
                            framewidth: 220,
                            frameheight: 180
                        });
                        this.addChild(this.visible_image);
                        break;
                   
                   case 2:
                        this.removeChild(this.visible_image);
                        this.visible_image = new gui_img("tutorial_2.png", 120, 96, { // background
                            framewidth: 220,
                            frameheight: 180
                        });
                        this.addChild(this.visible_image);
                        break;
                        
                   case 3:
                        this.visible_stage = 0;
                        this.removeChild(this.visible_image);
                        this.visible_image = null;
                        break;
               }
               console.log(this.visible_image)
               this.last_key_press = true
           }
       } else {
           this.last_key_press = false;
       }
    }
});

// create a basic GUI Object
var button = me.GUI_Object.extend( {
   init:function (image, x, y, settings)
   {
      this.last_key_press = false;
      this.x_loc = x;
      this.y_loc = y;
      var settings = {}
      settings.image = image;
      settings.framewidth = settings["framewidth"]; // 22
      settings.frameheight = settings["framehight"]; // 14
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   },

   // output something in the console
   // when the object is clicked
   onClick:function (event)
   {
      if (this.alpha != 0) {
          console.log("clicked!");
        me.levelDirector.loadLevel('path')
      }
      // don't propagate the event
      return false;
   },
   
   update:function() {
       if (me.input.isKeyPressed('inventory')) {
           if (!last_key_press) {
               game.data.gui.inventory_button_visible = !game.data.gui.inventory_button_visible;
           }
           last_key_press = true;
       } else {
           last_key_press = false;
       }
       if (game.data.gui.inventory_button_visible ) {
           this.alpha = 1;
		   game.data.frozen = true;
       } else {
		   if (game.data.frozen && (this.alpha == 1)) {
				this.alpha = 0;
				game.data.frozen = false;
		   }
       }
   }
   //,
   /*draw: function() {
      var settings = {}
      settings.image = "spider";
      settings.framewidth = 22;
      settings.frameheight = 14;
      // super constructor
      this._super(me.GUI_Object, "init", [this.x_loc, this.y_loc, settings]);
      // define the object z order
      this.pos.z = 4;
   } */
} );

// create a basic GUI Object
var gui_img = me.GUI_Object.extend( {
   init:function (image, x, y, settings)
   {
      this.last_key_press = false;
      this.x_loc = x;
      this.y_loc = y;
      var settings = {}
      settings.image = image;
      settings.framewidth = settings["framewidth"]; // 22
      settings.frameheight = settings["framehight"]; // 14
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   }
   
   //,
   /*draw: function() {
      var settings = {}
      settings.image = "spider";
      settings.framewidth = 22;
      settings.frameheight = 14;
      // super constructor
      this._super(me.GUI_Object, "init", [this.x_loc, this.y_loc, settings]);
      // define the object z order
      this.pos.z = 4;
   } */
} );