game.inventory = game.inventory || {};


game.inventory.Container = me.Container.extend({
    init: function() {
		this.last_key_press = false;
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "inventory";
        
        this.children = [];
        
        this.children[0] = new gui_img("inventory_back.png", 120, 96, { // background
            framewidth: 20,
            frameheight: 20
        });
        // add the object at pos (10,10)
        this.addChild(this.children[0]);
        this.children[0].alpha = 0;
        
        this.children[1] = new button("spider.png", 120, 96, {
            framewidth: 240,
            frameheight: 192
        });
        // add the object at pos (10,10)
        this.addChild(this.children[1]);
        this.children[1].alpha = 0;
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
       } else {
           this.alpha = 0;
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