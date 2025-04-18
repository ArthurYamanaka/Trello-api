export default function handler(req, res) {
  res.status(200).json({
    "openapi": "3.1.0",
    "info": {
      "title": "GPT Cards Trello",
      "version": "1.0.0",
      "description": "Cria cards no Trello com título, data e etiquetas usando um proxy sem confirmação."
    },
    "paths": {
      "/api/gptproxy": {
        "post": {
          "summary": "Cria um card no Trello com proxy",
          "operationId": "createCardProxy",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "description": "Título do card"
                    },
                    "due": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Data de entrega no formato ISO"
                    },
                    "labels": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "IDs das etiquetas"
                    }
                  },
                  "required": ["message"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Card criado com sucesso"
            }
          }
        }
      }
    },
    "x-openai": {
      "extensions": {
        "allowed_domains": ["trello-api-rho.vercel.app"]
      }
    }
  });
}
