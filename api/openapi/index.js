export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "GPT Cards Trello",
      version: "1.1.0",
      description: "Cria cards no Trello com título, data e etiquetas usando uma API pessoal hospedada na Vercel."
    },
    paths: {
      "/api/createCard": {
        post: {
          summary: "Cria um card no Trello",
          operationId: "createCard",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "O título do card a ser criado"
                    },
                    due: {
                      type: "string",
                      format: "date-time",
                      description: "A data de entrega do card (formato ISO: 2025-04-19T12:00:00.000Z)"
                    },
                    labels: {
                      type: "array",
                      items: {
                        type: "string"
                      },
                      description: "Lista de nomes das etiquetas já existentes no Trello"
                    }
                  },
                  required: ["message"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Card criado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      card: { type: "object" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    servers: [
      {
        url: "https://trello-api-rho.vercel.app",
        description: "Servidor da API pessoal do Arthur"
      }
    ],
    "x-openai": {
      api: {
        type: "openapi",
        url: "https://trello-api-rho.vercel.app/api/openapi"
      },
      auth: {
        type: "none"
      },
      capabilities: {
        gpt_metadata: true
      },
      request_domains: [
        "trello-api-rho.vercel.app"
      ]
    }
  });
}
