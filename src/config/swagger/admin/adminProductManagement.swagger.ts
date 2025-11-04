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

export const setupAdminProductManagementSwagger = (app: Express) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Admin Management API",
        version: "1.0.0",
        description:
          "API documentation for Admin Management endpoints (Products CRUD, etc.)",
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
              description: {
                type: "string",
                nullable: true,
                example: "Flagship smartphone",
              },
              price: { type: "number", example: 9999 },
              stock: { type: "integer", example: 50 },
              ownerId: { type: "integer", example: 1 },
              images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    url: {
                      type: "string",
                      example:
                        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    },
                  },
                },
              },
              categoryId: { type: "integer", example: 1 },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CreateProductDto: {
            type: "object",
            required: ["name", "price", "stock"],
            properties: {
              name: { type: "string", example: "iPhone 16 Pro" },
              description: {
                type: "string",
                nullable: true,
                example: "Flagship smartphone",
              },
              price: { type: "number", example: 9999 },
              stock: { type: "integer", example: 50 },
              ownerId: { type: "integer", example: 12 },
              categoryId: { type: "integer", example: 1 },
              images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "front-view" },
                    url: {
                      type: "string",
                      example:
                        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    },
                  },
                },
              },
            },
          },
          UpdateProductDto: {
            type: "object",
            properties: {
              name: { type: "string", example: "iPhone 16 Pro Max" },
              description: {
                type: "string",
                nullable: true,
                example: "Bigger display",
              },
              price: { type: "number", example: 10999 },
              stock: { type: "integer", example: 30 },
              categoryId: { type: "integer", example: 1 },
              addImages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "side-view" },
                    url: {
                      type: "string",
                      example:
                        "https://res.cloudinary.com/demo/image/upload/new.jpg",
                    },
                  },
                },
              },
              removeImageIds: {
                type: "array",
                items: { type: "integer", example: 2 },
              },
            },
          },
        },
      },
    },
    apis: ["./src/routes/admin/adminProductManagement.route.ts"],
  };

  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs/admin-product-management",
    swaggerUi.serveFiles(specs),
    swaggerUi.setup(specs)
  );
};
