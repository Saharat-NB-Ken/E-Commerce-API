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

export const setupAdminOrderManagementSwagger = (app: Express) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Admin Order Management API",
        version: "1.0.0",
        description: "API documentation for Admin Order Management endpoints (Orders CRUD, filtering, etc.)",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          OrderItemDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              productId: { type: "integer", example: 10 },
              quantity: { type: "integer", example: 2 },
              price: { type: "number", example: 1999 },
            },
          },
          OrderResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              userId: { type: "integer", example: 5 },
              status: { type: "string", enum: ["PENDING", "COMPLETED", "CANCELED"], example: "PENDING" },
              total: { type: "number", example: 3998 },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/OrderItemDto" },
              },
            },
          },
          UpdateOrderStatusDto: {
            type: "object",
            required: ["status"],
            properties: {
              status: {
                type: "string",
                enum: ["PENDING", "COMPLETED", "CANCELED"],
                example: "COMPLETED",
              },
            },
          },
        },
      },
    },
    apis: ["./src/routes/admin/adminOrderManagement.route.ts"], 
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs/admin-order-management", swaggerUi.serveFiles(specs), swaggerUi.setup(specs));
};
