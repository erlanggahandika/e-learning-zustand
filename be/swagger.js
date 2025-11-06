import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Member -Sekolah Casn',
    version: '1.0.0',
    description: 'API untuk sekolah casn',
  },
  servers: [
    {
      url: 'http://localhost',
      description: 'Development server',
    },
  ],
   components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      { bearerAuth: [] } // bisa default global
    ],
};

const options = {
  swaggerDefinition,
  apis: [
    './router/mobile/auth/authRouter.js',
    './router/web/auth/adminRouter.js',
    './router/mobile/notification/notifRouter.js',
    './router/mobile/kategori/kategoriRouter.js',
  ], // path ke file route kamu
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerDocs;
