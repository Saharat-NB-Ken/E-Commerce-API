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

export const setupAdminDashboardSwagger = (app: Express) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Admin Dashboard API",
        version: "1.0.0",
        description: "API documentation for Admin Dashboard endpoints (Merchant & Analytics)",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          ProductResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "iPhone 16 Pro" },
              description: { type: "string", nullable: true, example: "Flagship smartphone" },
              price: { type: "number", example: 9999 },
              stock: { type: "integer", example: 50 },
              ownerId: { type: "integer", example: 1 },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CreateProductDto: {
            type: "object",
            required: ["name", "price", "stock"],
            properties: {
              name: { type: "string", example: "iPhone 16 Pro" },
              description: { type: "string", nullable: true, example: "Flagship smartphone" },
              price: { type: "number", example: 9999 },
              stock: { type: "integer", example: 50 },
            },
          },
          UpdateProductDto: {
            type: "object",
            properties: {
              name: { type: "string", example: "iPhone 16 Pro Max" },
              description: { type: "string", nullable: true, example: "Bigger display" },
              price: { type: "number", example: 10999 },
              stock: { type: "integer", example: 30 },
            },
          },
          OrderResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              status: { type: "string", example: "COMPLETED" },
              total: { type: "number", example: 1500 },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productId: { type: "integer", example: 1 },
                    quantity: { type: "integer", example: 2 },
                    price: { type: "number", example: 999 },
                  },
                },
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          RevenueResponseDto: {
            type: "object",
            properties: {
              revenue: { type: "number", example: 12000 },
            },
          },
          NotificationResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              message: { type: "string", example: "New order received" },
              read: { type: "boolean", example: false },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    apis: ["./src/routes/admin/adminDashboard.route.ts"],
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs/admin-dashboard", swaggerUi.serveFiles(specs), swaggerUi.setup(specs));
};
