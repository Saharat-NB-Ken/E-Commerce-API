import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { Role } from "@prisma/client";

const globalSecurity = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
};

export const setupUserDashboardSwagger = (app: Express) => {
  // ========== USER DASHBOARD ==========
  const dashboardOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "User Dashboard API",
        version: "1.0.0",
        description: "API documentation for User Dashboard endpoints",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          ProfileResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              role: { type: "string", enum: Object.values(Role), example: "USER" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          MoneySpentResponseDto: {
            type: "object",
            properties: {
              total: { type: "number", example: 1500 },
            },
          },
          OrdersCountResponseDto: {
            type: "object",
            properties: {
              count: { type: "integer", example: 5 },
            },
          },
          ProductsByCategoryResponseDto: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string", example: "Electronics" },
                products: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      name: { type: "string", example: "iPhone 16 Pro" },
                      price: { type: "number", example: 9999 },
                      quantity: { type: "integer", example: 2 },
                    },
                  },
                },
              },
            },
          },
          CartResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              userId: { type: "integer", example: 1 },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    productId: { type: "integer", example: 1 },
                    quantity: { type: "integer", example: 2 },
                    price: { type: "number", example: 9999 },
                  },
                },
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          OrdersResponseDto: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                status: { type: "string", example: "COMPLETED" },
                total: { type: "number", example: 1500 },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
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
                payment: {
                  type: "object",
                  nullable: true,
                  properties: {
                    method: { type: "string", example: "Credit Card" },
                    amount: { type: "number", example: 1500 },
                    status: { type: "string", example: "PAID" },
                    paidAt: { type: "string", format: "date-time", nullable: true },
                  },
                },
              },
            },
          },
          NotificationsResponseDto: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                message: { type: "string", example: "Your order has been shipped" },
                read: { type: "boolean", example: false },
                createdAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    apis: ["./src/routes/user/userDashboard.route.ts"],
  };

  const dashboardSpecs = swaggerJsdoc(dashboardOptions);
  app.use("/api-docs/user-dashboard", swaggerUi.serveFiles(dashboardSpecs), swaggerUi.setup(dashboardSpecs));
};
