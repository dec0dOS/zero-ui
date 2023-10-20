const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "frontend", "public", "locales"); // Adjust the path if necessary

if (fs.existsSync(localesDir)) {
  const localesList = fs
    .readdirSync(localesDir)
    .filter((file) => {
      return fs.statSync(path.join(localesDir, file)).isDirectory();
    })
    .map((locale) => {
      const commonFilePath = path.join(localesDir, locale, "common.json");
      if (fs.existsSync(commonFilePath)) {
        const commonFile = require(commonFilePath);
        return {
          code: locale,
          name: commonFile.yourLanguage || locale,
        };
      }
      return {
        code: locale,
        name: locale,
      };
    });

  // Save the array to a JSON file
  const outputPath = path.join(
    __dirname,
    "frontend",
    "src",
    "utils",
    "localesList.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(localesList, null, 2));

  console.log(`Locales list saved to ${outputPath}`);
} else {
  console.error("Locales directory not found.");
}
