import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { WritableStream } from "node:stream/web";
import csvtojson from "csvtojson";

const PORT = 3000;

createServer(async (request, response) => {
  const headers = {
    "Access-Controll-Allow-Origin": "*",
    "Access-Controll-Allow-Methods": "*",
  };
  if (request.method === "options") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  Readable.toWeb(createReadStream("./animeflv.csv"))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeTo(
      new WritableStream({
        write(chunk) {
          response.write(chunk);
        },
        close() {
          response.end();
        },
      })
    );
})
  .listen(3000)
  .on("listening", (_) => console.log("Application is running at", PORT));
