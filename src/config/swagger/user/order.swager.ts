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

export const setupUserOrderSwagger = (app: Express) => {
  const orderOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "User Order API",
        version: "1.0.0",
        description: "API documentation for User Order endpoints",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          CreateOrderDto: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productId: { type: "integer", example: 1 },
                    quantity: { type: "integer", example: 2 },
                  },
                },
              },
            },
            required: ["userId", "items"],
          },
          OrderItemResponseDto: {
            type: "object",
            properties: {
              productId: { type: "integer", example: 1 },
              quantity: { type: "integer", example: 2 },
              price: { type: "number", example: 999 },
            },
          },
          OrderResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              status: { type: "string", example: "COMPLETED" },
              total: { type: "number", example: 1500 },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/OrderItemResponseDto" },
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
      },
    },
    apis: ["./src/routes/user/order.route.ts"],
  };

  const orderSpecs = swaggerJsdoc(orderOptions);
  app.use("/api-docs/user-order", swaggerUi.serveFiles(orderSpecs), swaggerUi.setup(orderSpecs));
};
