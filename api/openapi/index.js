export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "GPT Cards Trello",
      version: "1.0.0",
      description: "Cria cards no Trello diretamente, com suporte a nomes simples de etiquetas"
    },
    servers: [
      {
        url: "https://trello-api-rho.vercel.app"
      }
    ],
    paths: {
      "/api/createCard": {
        post: {
          summary: "Cria um card no Trello diretamente",
          operationId: "createCard",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string"
                    },
                    due: {
                      type: "string",
                      format: "date-time"
                    },
                    labels: {
                      type: "array",
                      items: {
                        type: "string"
                      }
                    }
                  },
                  required: ["message"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Card criado com sucesso"
            }
          }
        }
      }
    }
  });
}
