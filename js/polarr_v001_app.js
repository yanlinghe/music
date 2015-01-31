var Music;

Music = (function() {
  function Music() {}

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
    this.music = new Music;
    this.visual = new Visual;
  }

  Visualizer.prototype.start = function() {
    this.visual.init;
    return this.visual.render;
  };

  return Visualizer;

})();
