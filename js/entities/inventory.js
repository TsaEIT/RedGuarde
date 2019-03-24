game.inventory = game.inventory || {};


game.inventory.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "inventory";
        
        var test_button = new myButton(120, 96);
        // add the object at pos (10,10)
        this.addChild(test_button);
        test_button.alpha = 0;
    }
});

// create a basic GUI Object
var myButton = me.GUI_Object.extend(
{
   
   init:function (x, y)
   {
      this.last_key_press = false;
      this.x_loc = x;
      this.y_loc = y;
      var settings = {}
      settings.image = "spider";
      settings.framewidth = 22;
      settings.frameheight = 14;
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
});