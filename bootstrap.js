const pug = require("pug");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const fse = require("fs-extra");

// structure.json dosyasını oku ve yapılandırma verilerini al
const structure = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "structure.json"), "utf8")
);

// Giriş ve çıkış dizinlerini belirle
const inputDir = path.resolve(__dirname, structure.inputDir || "");
const outputDir = path.resolve(__dirname, structure.outputDir || "www");
const interval = structure.interval || 10000; // Milisaniye cinsinden izleme süresi
const mainTemplatePath = path.join(
  inputDir,
  structure.mainTemplate || "templates/layouts/main.pug"
); // Ana şablon yolu
const pagesDir = path.join(inputDir, structure.pagesDir || "templates/pages"); // Sayfa şablonları dizini

/**
 * Dizin yapısını oluşturan fonksiyon
 * @param {string} basePath - Temel dizin yolu
 * @param {object} structure - Oluşturulacak dizin ve dosya yapısı
 */
function createStructure(basePath, structure) {
  for (const key in structure) {
    const fullPath = path.join(basePath, key);
    // Dizin mevcut değilse oluştur
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Directory created: ${fullPath}`);
    }
    if (Array.isArray(structure[key])) {
      structure[key].forEach((file) => {
        const filePath = path.join(fullPath, file);
        // Dosya mevcut değilse oluştur
        if (!fs.existsSync(filePath)) {
          let content = "";
          // Ana şablon dosyası için varsayılan içerik
          if (file === "main.pug") {
            content = `
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title #{title}
    link(rel="stylesheet", href="/css/style.css")
  body
    include ../partials/header
    include ../partials/nav
    main
      block content
    include ../partials/footer
    script(src="/js/app.js")
            `;
            // Ana sayfa için varsayılan içerik
          } else if (file === "index.main.pug") {
            content = `
extends ../layouts/main
block content
  h2 Home Page
  p Welcome to the Home Page!
            `;
            // Hakkında sayfası için varsayılan içerik
          } else if (file === "about.main.pug") {
            content = `
extends ../layouts/main
block content
  h2 About Page
  p Welcome to the About Page!
            `;
          }
          // Dosya içeriğini yaz
          fs.writeFileSync(filePath, content);
          console.log(`File created: ${filePath}`);
        }
      });
    } else if (typeof structure[key] === "object") {
      // Alt dizinleri oluştur
      createStructure(fullPath, structure[key]);
    }
  }
}

/**
 * Pug şablonunu HTML'e dönüştüren fonksiyon
 * @param {string} templatePath - Şablon dosyasının yolu
 * @param {string} outputPath - Oluşturulacak HTML dosyasının yolu
 * @param {object} data - Şablon verileri
 */
function renderTemplate(templatePath, outputPath, data) {
  pug.renderFile(templatePath, data, (err, str) => {
    if (err) {
      console.error(`Error rendering ${templatePath}:`, err);
      return;
    }
    fs.writeFile(outputPath, str, (err) => {
      if (err) {
        console.error(`Error writing ${outputPath}:`, err);
        return;
      }
      console.log(`Successfully rendered ${outputPath}`);
    });
  });
}

/**
 * Tüm Pug şablonlarını HTML'e dönüştüren fonksiyon
 */
function renderAllTemplates() {
  const templates = fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".pug"));

  templates.forEach((template) => {
    const templatePath = path.join(pagesDir, template);
    let outputPath;

    // layout dosyasına göre çıkış yolu belirle
    if (template.includes(".main.pug")) {
      outputPath = path.join(outputDir, template.replace(".main.pug", ".html"));
    } else if (template.includes(".example.pug")) {
      const exampleDir = path.join(outputDir, "example");
      if (!fs.existsSync(exampleDir)) {
        fs.mkdirSync(exampleDir);
      }
      outputPath = path.join(
        exampleDir,
        template.replace(".example.pug", ".html")
      );
    }

    // Eğer outputPath tanımlanmadıysa, hatayı atlayarak devam eder
    if (!outputPath) {
      console.error(`Output path is not defined for template: ${template}`);
      return;
    }

    const bodyContent = fs.readFileSync(templatePath, "utf-8");

    const data = {
      title: template.replace(".pug", ""),
      body: bodyContent,
    };

    renderTemplate(mainTemplatePath, outputPath, data);
  });
}

/**
 * Genel varlıkları (public) kopyalayan fonksiyon
 * @param {string} src - Kaynak dizin yolu
 * @param {string} dest - Hedef dizin yolu
 */
function copyPublicDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyPublicDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`File copied: ${destPath}`);
    }
  }
}

/**
 * Genel varlıkları kopyalayan ana fonksiyon
 */
function copyPublicAssets() {
  const publicSrcDir = path.join(inputDir, "public");
  const publicDestDir = path.join(outputDir, "public");
  copyPublicDir(publicSrcDir, publicDestDir);
}

/**
 * Dosya değişikliklerini yöneten fonksiyon
 * @param {string} filePath - Değişen dosyanın yolu
 * @param {string} action - Dosya üzerinde yapılan işlem (add, change, unlink)
 */
function handleFileChange(filePath, action) {
  const relativePath = path.relative(inputDir, filePath);
  const destPath = path.join(outputDir, relativePath);

  if (relativePath.startsWith(structure.pagesDir)) {
    const outputPath = destPath.replace(".pug", ".html");

    switch (action) {
      case "add":
      case "change":
        const bodyContent = fs.readFileSync(filePath, "utf-8");
        const data = {
          title: path.basename(filePath, ".pug"),
          body: bodyContent,
        };
        renderTemplate(mainTemplatePath, outputPath, data);
        break;
      case "unlink":
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
          console.log(`File deleted: ${outputPath}`);
        }
        break;
      default:
        break;
    }
  } else if (relativePath.startsWith("public")) {
    switch (action) {
      case "add":
      case "change":
        fs.copyFileSync(filePath, destPath);
        console.log(`File copied: ${destPath}`);
        break;
      case "unlink":
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
          console.log(`File deleted: ${destPath}`);
        }
        break;
      default:
        break;
    }
  } else if (relativePath.startsWith("templates")) {
    return; // templates klasöründeki diğer değişiklikleri yoksay
  }
}

/**
 * Dosya ve dizin değişikliklerini izleyen fonksiyon
 */
function startWatcher() {
  const watcher = chokidar.watch(inputDir, {
    persistent: true,
  });

  watcher.on("add", (filePath) => handleFileChange(filePath, "add"));
  watcher.on("change", (filePath) => handleFileChange(filePath, "change"));
  watcher.on("unlink", (filePath) => handleFileChange(filePath, "unlink"));
  watcher.on("addDir", (dirPath) => handleFileChange(dirPath, "addDir"));
  watcher.on("unlinkDir", (dirPath) => handleFileChange(dirPath, "unlinkDir"));
}

/**
 * Çıktı dizinini temizleyen fonksiyon
 */
function clearOutputDir() {
  fse.emptyDirSync(outputDir);
  console.log(`Output directory ${outputDir} cleared.`);
}

// Çıktı dizini yoksa oluştur
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Yapıyı oluştur, tüm şablonları dönüştür, genel varlıkları kopyala ve izleyiciyi başlat
createStructure(inputDir, {
  templates: structure.templates,
  public: structure.public,
});
renderAllTemplates();
copyPublicAssets();
startWatcher();

// structure.json dosyasındaki interval değerine göre düzenli aralıklarla çıktı dizinini temizle ve yeniden oluştur
setInterval(() => {
  clearOutputDir();
  renderAllTemplates();
  copyPublicAssets();
}, interval);
