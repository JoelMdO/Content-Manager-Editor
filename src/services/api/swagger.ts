import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Docs",
      version: "1.0.0",
      description: "API documentation for my Next.js app",
    },
  },
  apis: ["../../app/api/*.ts"], // Adjust path for API files
};

const specs = swaggerJsdoc(options);
module.exports = specs;