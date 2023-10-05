import { exec } from "child_process";
import fs from "fs";

const loadStaticTest = (dir, name) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Ошибка чтения директории: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const url = `http://161.35.68.81/${name}/${file}`;

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

export default loadStaticTest