import fastify from "fastify";

const app = fastify();

app.post("/usuarios", async (request,reply) => {
  return reply.status(201).send()
});

app
  .listen({
    port: 3335,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });