export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "GPT Cards Trello",
      version: "1.0.0",
      description: "Cria cards no Trello usando uma API pessoal hospedada na Vercel."
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
                      description: "O nome/título do card a ser criado no Trello"
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
    ]
  });
}
