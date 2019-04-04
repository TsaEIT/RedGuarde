/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        this.current_level = me.levelDirector.getCurrentLevel().name;
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(2, 2);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        this.renderable.addAnimation("stand",  [1]);
        this.renderable.addAnimation("walk",  [1]);
        this.renderable.addAnimation("die",  [3, 1, 3, 1, 3, 1]);
        this.renderable.addAnimation("dead",  [4]);
        
        // set the standing animation as default
        this.renderable.setCurrentAnimation("walk");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if (!game.data.instructions_viewed) {
            if (this.current_level == 'tavern') {
                game.post_message("Press Tab For Instructions")
            }    
        }
               
		this.body.vel.x = 0;
		this.body.vel.y = 0;
        // game.data.player.x_cord = this.pos._x;
        // game.data.player.y_cord = this.pos._y;
        if (!this.alive) {
            this.body.vel.y = this.body.vel.x = 0;
            if (!this.renderable.isCurrentAnimation("die") && !this.renderable.isCurrentAnimation("dead")) {
//                this.renderable.setCurrentAnimation("die", "stand");
                this.renderable.setCurrentAnimation("die", "dead");
            }
            if (this.renderable.isCurrentAnimation("dead") && !game.data.wait_for_reload) {
                game.data.wait_for_reload = true;
                setTimeout(function () {
                    game.data.wait_for_reload = false;
                    if (--game.data.lives == 0) {
                        me.levelDirector.loadLevel("tavern")
                        game.data.lives = 3;
                        game.data.keys = 0;
                    } else {
                        game.data.keys = 0;
                        me.levelDirector.reloadLevel();
                    }                    
                }, 2000);

            }
            
            if (this.renderable.isCurrentAnimation("stand")) {
                this.alive = true;
            }
            
            this.body.update(dt);
            
            me.collision.check(this);
            
            return this._super(me.Entity, 'update', [dt]);
        }
        
        if (game.data.frozen) {
            moving = true;
            var stop_entity = me.game.world.children.find(function (e) {return e.name == 'stopEntity'});
            if (typeof(stop_entity) != 'undefined') {
                // update the entity velocity
                if (this.distanceTo(stop_entity) > 16) { //Return here
					this.body.vel.y = -0.3 * me.timer.tick;
                } else {
                    moving = false;
                    game.data.flag = true;
                }
            }
        } else {
            var moving = false;
            if (me.input.isKeyPressed('left')) {
                moving = true;
                // flip the sprite on horizontal axis
                this.renderable.flipX(true);

                // update the entity velocity
                this.body.vel.x -= this.body.accel.x * me.timer.tick;
                }
            else if (me.input.isKeyPressed('right')) {
                moving = true;
                // unflip the sprite
                this.renderable.flipX(false);

                // update the entity velocity
                this.body.vel.x += this.body.accel.x * me.timer.tick;
            } else {
                  this.body.vel.x = 0;
            }
            if (me.input.isKeyPressed('up')) {
                moving = true;

                // update the entity velocity
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
                }
            else if (me.input.isKeyPressed('down')) {
                moving = true;

                // update the entity velocity
                this.body.vel.y += this.body.accel.y * me.timer.tick;
            } else {
                  this.body.vel.y = 0;
            }
        }
        
        
        
        if (moving) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            if (!this.renderable.isCurrentAnimation("stand")) {
                this.renderable.setCurrentAnimation("stand");
            }
        }
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        if (response.b.body.collisionType == me.collision.types.ENEMY_OBJECT) {
          this.alive = false;
        }
        return true;
    }
});

/**
 * a Key entity
 */
game.KeyEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected

    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);
    
    game.data.keys += 1;

    return false
  }
});

game.unhideEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha = 0.9;
    
    // Handle Audio
    me.audio.stopTrack();
    me.audio.setVolume(1);
    me.audio.playTrack("cave-audio");

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha = 0;
    // me.game.world.children[1].alpha = 0;
    me.game.world.removeChild(this);
    
    return false
  }
});

game.doorEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    
    this.renderable.addAnimation("closed",  [0]);
    this.renderable.addAnimation("open",  [1]);
    this.renderable.setCurrentAnimation("closed");
    
    if (typeof(settings.direction) !== 'undefined') {
        this.renderable.addAnimation("closed",  [1]);
        this.renderable.addAnimation("open",  [0]);
        this.renderable.setCurrentAnimation("closed");
    } else {
        this.renderable.addAnimation("closed",  [0]);
        this.renderable.addAnimation("open",  [1]);
        this.renderable.setCurrentAnimation("closed");
    }
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (this.renderable.isCurrentAnimation("closed")) {
        if (game.data.keys > 0) {
            game.data.keys--;
            this.renderable.setCurrentAnimation("open");
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        } else {
            console.log("The Door Remains Shut");
            game.post_message("The Door Is Locked");
        }
      }
      return false;
  }
});

game.vampireEntity = me.Entity.extend({ // TODO: Re-add to tiled. AFTER REIGONALS!!! image: vampire, framewidth: 8
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    
    // this.renderable.addAnimation("normal",  [0]);
    // this.renderable.setCurrentAnimation("normal");
  },
  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      return false;
  }
});

game.stopEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
      this.current_level_name = me.levelDirector.getCurrentLevel().name
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    game.data.flag = false;
    game.data.frozen = true;
    me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha = 0;
    me.collision.check(this);
  },
  
  update : function (dt) {
      if (this.current_level_name == "jail_open_sub1") {
          game.post_message("Demon! Halt!")
      }
      var nex_lev = {
          "cave_sub2": "cutscene1",
          "jail_open_sub1": "prison_cell" // Just for tests
      };
      if (game.data.flag) {
          me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha += 0.01;
          if (me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha > 2) {
              game.data.flag = false;
              me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha = 1;
              game.data.frozen = false;
              me.levelDirector.loadLevel(nex_lev[this.current_level_name]);
          }
          // this.body.vel.y += 0.5 * me.timer.tick;
          // this.body.update(dt);
          
      }
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {    
    return false
  }
});
 
game.skelespiderEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    
    
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    
    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(0.6, 0.6);    
    this.renderable.addAnimation("stand",  [0]);
    this.renderable.setCurrentAnimation("stand");
  },
  update : function (dt) {
     var player = me.game.world.children.find(function (e) {return e.name == 'mainPlayer'});
     
     if (player.alive) {
         if (this.distanceTo(player) <= 80) {
             var angle = this.angleTo(player)
             this.body.vel.y += Math.sin(angle) * this.body.accel.y * me.timer.tick;
             this.body.vel.x += Math.cos(angle) * this.body.accel.x * me.timer.tick;
             this.body.update(dt);
         } else {
             this.body.vel.y = this.body.vel.x = 0;
             this.body.update(dt)
         }
     }
     
     // handle collisions against other shapes
     me.collision.check(this);
     
     // return true if we moved or if the renderable was updated
     return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);     
  },
  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (response.b.body.collisionType == me.collision.types.WORLD_SHAPE) {
          return true;
      }
      return false;
  }
});

game.spikesEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      return false;
  }
});

game.CutSceneEntity = me.CollectableEntity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        this.next_level = settings.next_level;
        me.game.world.children.find(function (e) {return e.name == 'Shadow'}).alpha = 0;
        me.game.world.children.find(function (e) {return e.name == 'Over_Shadow'}).alpha = 0;
        me.game.world.children.find(function (e) {return e.name == 'Overlay'}).alpha = 0;
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(0.5, 0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        this.state = 0;
    },

    /**
     * update the entity
     */
    update : function (dt) {
        var after_focus = me.game.world.children.find(function (e) {return e.name == 'Overlay'});
        var ov_sha = me.game.world.children.find(function (e) {return e.name == 'Over_Shadow'});
        switch(this.state) {
            case 0:
                this.body.vel.x += this.body.accel.x * me.timer.tick;
                break;
            case 1:
                after_focus.alpha += 0.1;
                if (after_focus.alpha >= 1) {
                    after_focus.alpha = 1;
                    this.state = 2;
                    game.post_message("This Gold Is Mine!");
                }
            case 2:
                ov_sha.alpha += 0.004;
                if (ov_sha.alpha >= 1) {
                    ov_sha.alpha = 1;
                    this.state = 3;
                    game.data.frozen = false;
                    game.post_message("I Can't Believe It!", function () {
                        game.post_message("He Stole The Gold!")
                    }) // Probably the worst way to do it
                    me.levelDirector.loadLevel(this.next_level);
                }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        var shadow = me.game.world.children.find(function (e) {return e.name == 'Shadow'});
        
        
        switch(this.state) {
            case 0:
                shadow.alpha += 0.01;
                if (shadow.alpha >= 1) {
                    this.pos._x = 48;
                    shadow.alpha = 1;
                    this.state = 1;
                }
                break;

        }
        

        return true;
    }
});