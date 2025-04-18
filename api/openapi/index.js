export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "GPT Cards Trello",
      version: "1.0.0",
      description: "Cria cards no Trello com título, data e etiquetas via proxy sem confirmação"
    },
    servers: [
      {
        url: "https://trello-api-rho.vercel.app"
      }
    ],
    paths: {
      "/api/createCardProxy": {
        post: {
          summary: "Cria um card no Trello (via Proxy)",
          operationId: "createCardProxy",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Título do card"
                    },
                    due: {
                      type: "string",
                      format: "date-time",
                      description: "Data no formato ISO"
                    },
                    labels: {
                      type: "array",
                      items: {
                        type: "string"
                      },
                      description: "Lista de nomes de etiquetas (que serão convertidos para ID)"
                    }
                  },
                  required: ["message"]
                }
              }
            }
          },
          responses: {
            200: {
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
          },
          "x-openai-api-dispatch": {
            "allowed_domains": ["trello-api-rho.vercel.app"]
          }
        }
      }
    },
    "x-openai": {
      extensions: {
        allowed_domains: ["trello-api-rho.vercel.app"]
      }
    }
  });
}
