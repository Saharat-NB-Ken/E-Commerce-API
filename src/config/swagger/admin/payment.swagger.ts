import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const globalSecurity = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
};

export const setupPaymentManagementSwagger = (app: Express) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Payment Management API",
        version: "1.0.0",
        description:
          "API documentation for Payment endpoints",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
      }
    },
    apis: ["./src/routes/admin/payment.route.ts"],
  };

  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs/payment",
    swaggerUi.serveFiles(specs),
    swaggerUi.setup(specs)
  );
};
