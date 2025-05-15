module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transform: {
      '^.+\\.(ts|html)$': 'ts-jest', // Transforma archivos .ts y .html
    },
    transformIgnorePatterns: [
      'node_modules/(?!.*\\.mjs$)', // Permite la transformación de archivos .mjs en node_modules
    ],
    testEnvironment: 'jest-environment-jsdom',
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  };
  