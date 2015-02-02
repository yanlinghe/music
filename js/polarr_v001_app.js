var Music;

Music = (function() {
  function Music(options) {
    this.filename = options.filename;
    this.ctx;
    this.buf;
    this.fft;
    this.samples = 128;
    this.setup = false;
    this.gfx;
    this.wWidth;
    this.wHeight;
    this.height = 300;
  }

  Music.prototype.init = function() {
    var e;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      console.log(this.ctx);
      return this.loadFile();
    } catch (_error) {
      e = _error;
      return alert('no web audio support');
    }
  };

  Music.prototype.loadFile = function() {
    var req;
    req = new XMLHttpRequest();
    console.log(this.filename);
    req.open('GET', this.filename, true);
    req.responseType = 'arraybuffer';
    req.onload = (function(_this) {
      return function() {
        console.log(_this.ctx);
        return _this.ctx.decodeAudioData(req.response, function(buffer) {
          _this.buf = buffer;
          _this.play();
          _this.setupCanvas();
          return _this.update();
        });
      };
    })(this);
    return req.send();
  };

  Music.prototype.play = function() {
    var src;
    src = this.ctx.createBufferSource();
    src.buffer = this.buf;
    this.fft = this.ctx.createAnalyser();
    this.fft.fftSize = this.samples;
    src.connect(this.fft);
    this.fft.connect(this.ctx.destination);
    src.start(0);
    return this.setup = true;
  };

  Music.prototype.setupCanvas = function() {
    var canvas;
    canvas = document.getElementById('canvas');
    this.gfx = canvas.getContext('2d');
    this.wWidth = document.body.clientWidth;
    this.wHeight = document.body.clientHeight;
    canvas.width = this.wWidth;
    return canvas.height = this.height;
  };

  Music.prototype.update = function() {
    var barHeight, barWidth, bufferLength, data, i, x, _i, _results;
    requestAnimationFrame(this.update.bind(this));
    if (!this.setup) {
      return;
    }
    this.gfx.clearRect(0, 0, this.wWidth, this.height);
    this.gfx.fillStyle = 'rgb(20, 20, 20)';
    this.gfx.fillRect(0, 0, this.wWidth, this.height);
    bufferLength = this.fft.frequencyBinCount;
    data = new Uint8Array(bufferLength);
    this.fft.getByteFrequencyData(data);
    barWidth = this.wWidth / bufferLength;
    barHeight;
    x = 0;
    _results = [];
    for (i = _i = 0; 0 <= bufferLength ? _i <= bufferLength : _i >= bufferLength; i = 0 <= bufferLength ? ++_i : --_i) {
      barHeight = data[i] / 2;
      this.gfx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
      this.gfx.fillRect(x, this.height - barHeight, barWidth, barHeight);
      _results.push(x += barWidth + 1);
    }
    return _results;
  };

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
    for (zpos = _i = -1000; _i <= 1000; zpos = _i += 20) {
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
      particle.position.x = Math.random() * 1000 - 500;
      particle.position.y = Math.random() * 1000 - 500;
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
    this.scene1 = new Scene1({
      scene: this.scene,
      composer: this.composer,
      camera: this.camera
    });
  }

  Visual.prototype.init = function() {
    this.container.appendChild(this.renderer.domElement);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    return this.scene1.start();
  };

  Visual.prototype.render = function() {
    requestAnimationFrame(this.render.bind(this));
    this.scene1.update();
    return this.composer.render();
  };

  return Visual;

})();

var Visualizer;

Visualizer = (function() {
  function Visualizer(options) {
    this.music = new Music({
      filename: 'numb.mp3'
    });
    this.visual = new Visual;
  }

  Visualizer.prototype.start = function() {
    this.music.init();
    this.visual.init();
    return this.visual.render();
  };

  return Visualizer;

})();
