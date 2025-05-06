const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1366,  // Defina a largura desejada
    viewportHeight: 768   // Defina a altura desejada
  },
});
