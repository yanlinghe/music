var Music;

Music = (function() {
  function Music() {}

  return Music;

})();

var Scene1;

Scene1 = (function() {
  function Scene1(options) {
    this.scene = options.scene, this.composer = options.composer, this.camera = options.camera;
    this.particles = [];
  }

  Scene1.prototype.start = function() {
    var effect;
    this.makeParticles();
    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.00;
    effect.renderToScreen = true;
    this.composer.addPass(effect);
    setInterval(this.update, 1000 / 30);
    this.angle = 0;
    this.radius = 10;
    this.count = 0;
    return this.color = 0;
  };

  Scene1.prototype.update = function() {
    var particle, _i, _len, _ref, _results;
    this.count++;
    if ((this.count % 3) === 0) {
      this.color += 0.01;
      if (this.color > 1) {
        this.color = 0;
      }
      _ref = this.particles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        particle.position.z += 30;
        this.angle += 45;
        if (this.angle > 360) {
          this.angle = 0;
        }
        particle.material.color.setHSL(this.color, 1, 0.7);
        if (particle.position.z > 1000) {
          _results.push(particle.position.z -= 2000);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  Scene1.prototype.makeParticles = function() {
    var material, particle, particleTexture, spriteMaterial, zpos, _i;
    for (zpos = _i = -5000; _i <= 5000; zpos = _i += 20) {
      material = new THREE.SpriteMaterial({
        color: 0xffffff
      });
      particleTexture = THREE.ImageUtils.loadTexture('textures/spark.png');
      spriteMaterial = new THREE.SpriteMaterial({
        map: particleTexture,
        useScreenCoordinates: false,
        color: 0xffffff
      });
      particle = new THREE.Particle(spriteMaterial);
      particle.material.color.setHSL(1, 0.7, 0.6);
      particle.position.x = Math.random() * 2000 - 1000;
      particle.position.y = Math.random() * 2000 - 1000;
      particle.position.z = zpos;
      particle.scale.x = particle.scale.y = 80;
      this.scene.add(particle);
      this.particles.push(particle);
    }
    return {
      particleRender: function(context) {
        context.beginPath();
        context.arc(0, 0, 1, 0, Math.PI * 2, true);
        return context.fill();
      },
      updateParticles: function() {
        var i, _j, _ref, _results;
        _results = [];
        for (i = _j = 0, _ref = this.particles.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
          particle = this.particles[i];
          particle.position.z += 0.1;
          if (particle.position.z > 1000) {
            _results.push(particle.position.z -= 2000);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
  };

  return Scene1;

})();

var AMOUNTX, AMOUNTY, PI2, SEPARATION, Scene2;

SEPARATION = 100;

AMOUNTX = 50;

AMOUNTY = 50;

PI2 = Math.PI * 2;

Scene2 = (function() {
  function Scene2(options) {
    this.scene = options.scene, this.composer = options.composer, this.camera = options.camera;
    this.camera.position.y = 1000;
    this.camera.position.z = 1000;
    this.particles = new Array();
    this.count = 0;
  }

  Scene2.prototype.start = function() {
    var effect, i, ix, iy, material, particle, _i, _results;
    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.0015;
    effect.renderToScreen = true;
    this.composer.addPass(effect);
    material = new THREE.SpriteMaterial({
      color: 0xffffff
    });
    i = 0;
    _results = [];
    for (ix = _i = 0; 0 <= AMOUNTX ? _i < AMOUNTX : _i > AMOUNTX; ix = 0 <= AMOUNTX ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (iy = _j = 0; 0 <= AMOUNTY ? _j < AMOUNTY : _j > AMOUNTY; iy = 0 <= AMOUNTY ? ++_j : --_j) {
          particle = this.particles[i++] = new THREE.Sprite(material);
          particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          _results1.push(this.scene.add(particle));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Scene2.prototype.update = function() {
    var i, ix, iy, particle, _i, _j;
    i = 0;
    for (ix = _i = 0; 0 <= AMOUNTX ? _i < AMOUNTX : _i > AMOUNTX; ix = 0 <= AMOUNTX ? ++_i : --_i) {
      for (iy = _j = 0; 0 <= AMOUNTY ? _j < AMOUNTY : _j > AMOUNTY; iy = 0 <= AMOUNTY ? ++_j : --_j) {
        particle = this.particles[i++];
        particle.position.y = (Math.sin((ix + this.count) * 0.3) * 50) + (Math.sin((iy + this.count) * 0.5) * 50);
        particle.scale.x = particle.scale.y = (Math.sin((ix + this.count) * 0.3) + 1) * 4 + (Math.sin((iy + this.count) * 0.5) + 1) * 4;
      }
    }
    return this.count += 0.1;
  };

  return Scene2;

})();

var Visual;

Visual = (function() {
  function Visual(options) {
    this.container = document.getElementById('container');
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 4000);
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer = new THREE.EffectComposer(this.renderer);
    this.scene2 = new Scene2({
      scene: this.scene,
      composer: this.composer,
      camera: this.camera
    });
  }

  Visual.prototype.init = function() {
    this.container.appendChild(this.renderer.domElement);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    return this.scene2.start();
  };

  Visual.prototype.render = function() {
    requestAnimationFrame(this.render.bind(this));
    this.scene2.update();
    return this.composer.render();
  };

  return Visual;

})();

var Visualizer;

Visualizer = (function() {
  function Visualizer(options) {
    this.music = new Music;
    this.visual = new Visual;
  }

  Visualizer.prototype.start = function() {
    this.visual.init();
    return this.visual.render();
  };

  return Visualizer;

})();
