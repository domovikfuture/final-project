import fs from "fs";
import path from "path";
import { exec } from "child_process";

const __dirname = path.resolve();

const uploadsDir = path.resolve(__dirname, "uploads");
const imagesDir = path.resolve(__dirname, "images");

const loadStaticTest = (dir, name) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Ошибка чтения директории: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const url = `http://localhost:3000/${name}/${file}`;

      exec(`ab -n 1000 -c 100 ${url}`, (err, stdout) => {
        if (err) {
          console.error(`Ошибка выполнения Apache Bench: ${err}`);
          return;
        }

        console.log(
          `Результаты нагрузочного тестирования для файла ${filePath}:`
        );
        console.log(stdout);
      });
    });
  });
};

loadStaticTest(uploadsDir, 'uploads')
loadStaticTest(imagesDir, 'images')
