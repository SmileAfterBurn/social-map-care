// Import the defineConfig function from the vite package.
// This function is used to create a Vite configuration object.
import { defineConfig } from 'vite';

// Import the react plugin from the @vitejs/plugin-react package.
// This plugin enables React support in Vite.
import react from '@vitejs/plugin-react';

// Export the Vite configuration object.
export default defineConfig({
  // Use the react plugin.
  plugins: [react()],
  // Configure the build process.
  build: {
    // Specify the output directory for the build.
    outDir: 'build',
    // Disable sourcemaps for the build.
    sourcemap: false,
    // Set the chunk size warning limit to 1600KB.
    chunkSizeWarningLimit: 1600,
  },
  // Configure the development server.
  server: {
    // Specify the port for the development server.
    port: 3000,
  }
});
