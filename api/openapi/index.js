export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "Trello GPT Assistant",
      version: "1.0.0",
      description: "Conecte-se ao Trello para criar e visualizar cards, listas e quadros diretamente com o ChatGPT.",
    },
    servers: [
      {
        url: "https://trello-api-rho.vercel.app",
        description: "Servidor de integração com Trello",
      },
    ],
    paths: {
      "/api/createCard": {
        post: {
          summary: "Cria um novo card no Trello",
          operationId: "createCard",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    due: { type: "string", format: "date-time" },
                    idLabels: {
                      type: "array",
                      items: { type: "string" },
                    },
