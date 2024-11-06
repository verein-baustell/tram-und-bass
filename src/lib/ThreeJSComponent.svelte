<script lang="ts">
  import * as THREE from "three";
  import { onMount } from "svelte";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { vimeoVideoObject } from "../store";

  let canvas: HTMLCanvasElement; // Reference to the canvas element
  let model: THREE.Group | null = null; // To hold the loaded model

  onMount(() => {
    // Create the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background

    camera.position.z = 0.5; // Position the camera

    // Add stronger lighting for a brighter model
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
    scene.add(ambientLight);

    // Add a stronger directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // Brighter white light
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Add a spotlight for emphasis on the model (optional)
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 5, 5);
    spotLight.target.position.set(0, 0, 0);
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Add a spotlight for emphasis on the model (optional)
    const spotLight2 = new THREE.SpotLight(0xffffff, 10);
    spotLight2.position.set(-3, -2, 2);
    spotLight2.target.position.set(0, 0, 0);
    spotLight2.angle = Math.PI / 6;
    scene.add(spotLight2);
    scene.add(spotLight2.target);

    // Load the 3D model with GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      "/models/play.glb", // Path to the GLTF or GLB model file
      (gltf) => {
        model = gltf.scene; // Store the model
        scene.add(model);
        model.position.set(0, 0, 0); // Center the model

        // Make model material shinier
        model.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            const material = child.material as THREE.MeshStandardMaterial;
            material.metalness = 0.5; // Fully metallic
            material.roughness = 0.2; // Smooth surface
            // material.emissive = new THREE.Color(0xff0000); // Emissive glow (optional)
            material.emissiveIntensity = 0.5; // Optional emissive intensity
            material.needsUpdate = true;
          }
        });
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the model:", error);
      }
    );

    // Calculate mouse position and make the model face the mouse
    const mouse = new THREE.Vector2();

    // Add mouse move event listener
    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to the range of -1 to 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Raycaster for detecting clicks on the model
    const raycaster = new THREE.Raycaster();

    // Handle mouse click event
    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Ensure the model's world matrix is updated before raycasting
      if (model) {
        model.updateMatrixWorld(true); // Update the matrix world of the model (and its descendants)

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with the model
        const intersects = raycaster.intersectObject(model, true); // Check all descendant objects

        if (intersects.length > 0) {
          console.log("Model clicked:", intersects[0]);
          // Handle the click event here (e.g., trigger animations, etc.)
          $vimeoVideoObject.play();
        }
      }
    };

    window.addEventListener("click", onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (model) {
        // Update the model rotation to look at the mouse position
        const vector = new THREE.Vector3(-mouse.x, -mouse.y, -0.5); // Set the Z value to adjust the depth
        vector.unproject(camera); // Convert to world space

        const dir = vector.sub(camera.position).normalize(); // Direction from camera to the mouse position
        const distance = camera.position.distanceTo(vector);
        const speed = 0.05; // Rotation speed

        // Update the model's rotation
        model.lookAt(vector); // Look at the mouse position in world space

        // Optionally, you can rotate the model gradually to make the transition smoother
        model.rotation.x += dir.x * speed;
        model.rotation.y += dir.y * speed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      renderer.dispose();
    };
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  /* Make the canvas fullscreen and overlay */
  canvas {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1000;
  }
</style>
