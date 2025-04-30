import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description: "API documentation for the Notes project",
    },
    servers: [
      {
        url: "https://notes-api-a6e8.onrender.com/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Note: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6605f83b1234567890123456",
            },
            title: {
              type: "string",
              example: "My Note",
            },
            content: {
              type: "string",
              example: "This is the content of the note.",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["tag1", "tag2"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
