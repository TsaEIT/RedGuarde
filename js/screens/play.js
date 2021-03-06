game.PlayScreen = me.ScreenObject.extend({
  /**
   * action to perform on state change
   */
  onResetEvent : function () {
    // load a level
    me.levelDirector.loadLevel("tavern");

    // reset the score
    game.data.score = 0;

    // add our HUD to the game world
    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);
    
    // add our HUD to the game world
    this.inventory = new game.inventory.Container();
    me.game.world.addChild(this.inventory);
    
    
    me.audio.setVolume(1)
    me.audio.playTrack("tavern-audio");
  },

  /**
   * action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function () {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
    
    me.audio.stopTrack();
  }
});
