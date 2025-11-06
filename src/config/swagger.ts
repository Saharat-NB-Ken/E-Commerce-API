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

export const setupSwagger = (app: Express) => {
  // ========== USER ==========
  const userOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "User API",
        version: "1.0.0",
        description: "API documentation for User management",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          UserResponse: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              role: { type: "string", example: "USER" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CreateUser: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              password: { type: "string", example: "secret123" },
            },
          },
          UpdateUser: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@xample.com" },
            },
          },
        },
      },
    },
    apis: ["./src/routes/user/user.route.ts"],
  };
  const userSpecs = swaggerJsdoc(userOptions);
  app.use("/api-docs/user", swaggerUi.serveFiles(userSpecs), swaggerUi.setup(userSpecs));

  // ========== AUTH ==========
  const authOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Auth API",
        version: "1.0.0",
        description: "API documentation for Authentication",
      },
      components: {
        schemas: {
          UserResponse: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@egmail.com" },
              role: { type: "string", example: "USER" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          LoginUser: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "user@gmail.com" },
              password: { type: "string", example: "string" },
            },
          },
          RegisterUser: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              password: { type: "string", example: "secret123" },
              confirmPassword: { type: "string", example: "secret123" },
            },
          },

        },
      },
    },
    apis: ["./src/routes/auth.route.ts"],
  };
  const authSpecs = swaggerJsdoc(authOptions);
  app.use("/api-docs/auth", swaggerUi.serveFiles(authSpecs), swaggerUi.setup(authSpecs));

  // ========== PRODUCT ==========
  const productOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product API",
        version: "1.0.0",
        description: "API documentation for Product management",
      },
      components: {
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
              category: {
                type: "string",
                nullable: true,
                example: "Electronics"
              },
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
              price: { type: "number", example: 9999 },
              stock: { type: "integer", example: 30 },
            },
          },
        },
      },
    },
    apis: ["./src/routes/product.route.ts"],
  };

  const productSpecs = swaggerJsdoc(productOptions);
  app.use("/api-docs/product", swaggerUi.serveFiles(productSpecs), swaggerUi.setup(productSpecs));

  // ========== CART ==========
  const cartOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Cart API",
        version: "1.0.0",
        description: "API documentation for Cart management",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          CartItemResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              productId: { type: "integer", example: 1 },
              quantity: { type: "integer", example: 2 },
              price: { type: "number", example: 9999 },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CartResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              userId: { type: "integer", example: 1 },
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/CartItemResponseDto" },
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          AddCartItemDto: {
            type: "object",
            required: ["productId", "quantity"],
            properties: {
              productId: { type: "integer", example: 1 },
              quantity: { type: "integer", example: 2 },
            },
          },
          UpdateCartItemDto: {
            type: "object",
            required: ["cartItemId", "quantity"],
            properties: {
              cartItemId: { type: "integer", example: 1 },
              quantity: { type: "integer", example: 3 },
            },
          },
        },
      },
    },
    apis: ["./src/routes/user/cart.route.ts"],
  };
  const cartSpecs = swaggerJsdoc(cartOptions);
  app.use("/api-docs/cart", swaggerUi.serveFiles(cartSpecs), swaggerUi.setup(cartSpecs));

  // ========== EMAIL ==========
  const emailOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Email API",
        version: "1.0.0",
        description: "API documentation for Email notifications",
      },
      components: {
        securitySchemes: globalSecurity,
        schemas: {
          SendWelcomeEmailRequest: {
            type: "object",
            required: ["email", "name"],
            properties: {
              email: { type: "string", example: "user@example.com" },
              name: { type: "string", example: "John Doe" },
            },
          },
          SendWelcomeEmailResponse: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Email sent successfully" },
            },
          },
        },
      },
    },
    apis: ["./src/routes/email.route.ts"],
  };

  // ========== CATEGORY ==========
  const categoryOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Category API",
        version: "1.0.0",
        description: "API documentation for Category management",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          CategoryNameArray: {
            type: "array",
            items: {
              type: "string",
              example: "Electronics",
            },
            example: [
              "Electronics",
              "Fashion",
              "Home & Living",
              "Health & Beauty",
              "Sports & Outdoors",
              "Books & Stationery",
              "Toys & Games",
            ],
          },
          CreateCategoryDto: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", example: "Electronics" },
            },
          },
          UpdateCategoryDto: {
            type: "object",
            properties: {
              name: { type: "string", example: "Electronics & Gadgets" },
            },
          },
          CategoryResponseDto: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "Electronics" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },

      },
    },
    apis: ["./src/routes/category.route.ts"],
  };

  const categorySpecs = swaggerJsdoc(categoryOptions);
  app.use("/api-docs/category", swaggerUi.serveFiles(categorySpecs), swaggerUi.setup(categorySpecs));

  const emailSpecs = swaggerJsdoc(emailOptions);
  app.use("/api-docs/email", swaggerUi.serveFiles(emailSpecs), swaggerUi.setup(emailSpecs));

};
