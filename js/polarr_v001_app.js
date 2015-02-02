var Music;

Music = (function() {
  function Music(options) {
    console.log('here');
    this.filename = options.filename;
    this.ctx;
    this.buf;
    this.fft;
    this.samples = 128;
    this.setup = false;
  }

  Music.prototype.init = function() {
    var e;
    console.log('in init');
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
          return _this.play();
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

  return Music;

})();

var Visual;

Visual = (function() {
  function Visual(options) {
    this.container;
    this.camera;
    this.scene;
    this.renderer;
    this.mesh;
  }

  Visual.prototype.init = function() {
    this.container = document.getElementById('container');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    return this.container.appendChild(this.renderer.domElement);
  };

  Visual.prototype.render = function() {
    requestAnimationFrame(this.render);
    return this.renderer.render(this.scene, this.camera);
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
    return this.music.init();
  };

  Visualizer.visual.init();

  Visualizer.visual.render();

  return Visualizer;

})();
