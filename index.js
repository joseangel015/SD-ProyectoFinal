// magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d
// magnet:?xt=urn:btih:4MR6HU7SIHXAXQQFXFJTNLTYSREDR5EI&tr=http://tracker.vodo.net:6970/announce

"use strict";

// Importamos el paquete webtorrent-hybrid
import WebTorrent from "webtorrent-hybrid";

// Importamos el módulo File System
import fs from "fs";

// Importamos el módulo cli-progress
import cliProgress from "cli-progress";

// Obtenemos el ID del torrent a través de los argumentos de línea de comandos
const idTorrent = process.argv[2];

console.log("ID del Torrent:~ \t" + idTorrent);

// Creamos un cliente de WebTorrent
const cliente = new WebTorrent();

// Creamos nuestra barra de progreso
const barraProgreso = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// Agregamos el torrent al cliente
cliente.add(idTorrent, (torrent) => {
  const archivos = torrent.files;
  let cantidadArchivos = archivos.length;

  console.log("Cantidad de archivos: ~ \t" + cantidadArchivos);
  barraProgreso.start(100, 0);

  // Iteramos sobre cada archivo del torrent
  archivos.forEach((archivo) => {
    const fuente = archivo.createReadStream();
    const destino = fs.createWriteStream(archivo.name);

    // Cuando se recibe un nuevo chunk de datos
    fuente.on("data", (chunk) => {
      
      // Actualizamos la barra de progreso con la longitud del chunk recibido
      barraProgreso.increment(chunk.length);
    });

    // Cuando se ha completado la descarga del archivo
    fuente.on("end", () => {
      console.log("Archivo: \t\t", archivo.name);
      cantidadArchivos -= 1;
      if (cantidadArchivos === 0) {
        // Todos los archivos han sido descargados
        barraProgreso.stop();
        process.exit();
      }
    });

    fuente.pipe(destino);
  });
});