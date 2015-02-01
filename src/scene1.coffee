class Scene1
	constructor: (options) ->
		{@scene, @composer, @camera} = options
		@particles = []

	start: () ->
		@makeParticles()

		# effect = new THREE.ShaderPass( THREE.CopyShader )

		effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms[ 'amount' ].value = 0.00;
		# effect.renderToScreen = true;
		# @composer.addPass( effect );
		effect.renderToScreen = true
		@composer.addPass( effect )
				
		# render 30 times a second (should also look 
		# at requestAnimationFrame) 
		setInterval(@update,1000/30)
		@angle = 0
		@radius = 10
		@count = 0
		@color = 0

	update: () ->
		@count++
		if ( @count % 3 )== 0
			@color += 0.01
			if @color > 1
				@color = 0
			for particle in @particles
		
				# particle = @particles[i]; 
			
				# and move it forward dependent on the mouseY position. 
				particle.position.z +=  30
				@angle += 45
				if @angle > 360
					@angle = 0
				# particle.position.y = @radius * Math.cos(@angle)
				# particle.position.x = @radius * Math.sin(@angle)
				particle.material.color.setHSL( @color, 1, 0.7 )
				# particle.position.x += particle.position.x * Math.sin(10)
			
				# if the particle is too close move it to the back
				if particle.position.z > 1000
					particle.position.z -= 2000
		# @updateParticles()

		# and render the scene from the perspective of the camera
		# renderer.render( scene, camera )

	makeParticles: () ->
		# we're gonna move from z position -1000 (far away) 
		# to 1000 (where the camera is) and add a random particle at every pos. 
		for zpos in [-1000..1000] by 20
		
			# we make a particle material and pass through the 
			# colour and custom particle render function we defined. 
			material = new THREE.SpriteMaterial( { color: 0xffffff} )
			particleTexture = THREE.ImageUtils.loadTexture( 'textures/spark.png' )
			spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, useScreenCoordinates: false, color: 0xffffff } )
		
			# make the particle
			particle = new THREE.Particle(spriteMaterial)
			particle.material.color.setHSL( 1, 0.7, 0.6 )
			# give it a random x and y position between -500 and 500
			particle.position.x = Math.random() * 1000 - 500
			particle.position.y = Math.random() * 1000 - 500
		
			# set its z position
			particle.position.z = zpos
		
			# scale it up a bit
			particle.scale.x = particle.scale.y = 80
		
			# add it to the scene
			@scene.add( particle )
		
			# and to the array of particles. 
			@particles.push(particle)

		# there isn't a built in circle particle renderer 
		# so we have to define our own. 

		particleRender: ( context ) ->
			# we get passed a reference to the canvas context
			context.beginPath()
			# and we just have to draw our shape at 0,0 - in this
			# case an arc from 0 to 2Pi radians or 360º - a full circle!
			context.arc( 0, 0, 1, 0,  Math.PI * 2, true )
			context.fill()

		# moves all the particles dependent on mouse position
			
		updateParticles: () ->
				
			# iterate through every particle
			for i in [0...@particles.length]
	
				particle = @particles[i]; 
		
				# and move it forward dependent on the mouseY position. 
				particle.position.z +=  0.1
		
				# if the particle is too close move it to the back
				if particle.position.z > 1000
					particle.position.z -= 2000
