const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Primetrade Assignment API',
    version: '1.0.0',
    description: 'REST API with JWT auth, RBAC and task CRUD'
  },
  servers: [{ url: 'http://localhost:5000/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/docs/*.yaml']
};

module.exports = swaggerJSDoc(options);