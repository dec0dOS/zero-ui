import fs from "fs";
import path from "path";

export default function GenerateLocalesPlugin() {
  return {
    name: "generate-locales",
    buildStart() {
      const localesDir = path.resolve(__dirname, "public", "locales");

      if (fs.existsSync(localesDir)) {
        const localesList = fs
          .readdirSync(localesDir)
          .filter((file) => {
            return fs.statSync(path.join(localesDir, file)).isDirectory();
          })
          .map((locale) => {
            const commonFilePath = path.join(localesDir, locale, "common.json");
            if (fs.existsSync(commonFilePath)) {
              const commonFile = JSON.parse(
                fs.readFileSync(commonFilePath, "utf-8")
              );
              return {
                code: locale,
                name: commonFile.languageName || locale,
              };
            }
            return {
              code: locale,
              name: locale,
            };
          });

        // Save the array to a JSON file
        const outputPath = path.resolve(
          __dirname,
          "src",
          "utils",
          "localesList.json"
        );
        fs.writeFileSync(outputPath, JSON.stringify(localesList, null, 2));

        console.log(`Locales list saved to ${outputPath}`);
      } else {
        console.error("Locales directory not found.");
      }
    },
  };
}
