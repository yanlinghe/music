class Visual
	constructor: (options) ->
		@container
		
		@camera
		@scene
		@renderer

		@mesh

	init: () ->
		@container = document.getElementById( 'container' )

		@scene = new THREE.Scene()

		@camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
		
		@renderer = new THREE.WebGLRenderer()

		@renderer.setSize( window.innerWidth, window.innerHeight )
		@container.appendChild( @renderer.domElement )

	render: () ->
		requestAnimationFrame( @render )
		@renderer.render( @scene, @camera )

