/**
 * Setup React Component CLI tool:
 * https://levelup.gitconnected.com/how-to-generate-react-components-from-your-terminal-a27741a5b862
 */

const fs = require("fs");
const { component, test, barrel } = require("./component_templates.js");

const COMPONENTS_DIRECTORY = "./src/components";

const writeFileErrorHandler = (err) => {
  if (err) throw err;
};

// check if '.src/components' directory exists
if (!fs.existsSync(COMPONENTS_DIRECTORY)) {
  console.log("Creating Components Directory...");
  fs.mkdirSync(COMPONENTS_DIRECTORY, { recursive: true });
  fs.writeFile(`${COMPONENTS_DIRECTORY}/index.ts`, "", writeFileErrorHandler);
  console.log("Created Components Directory!");
}

// grab component name from terminal argument
const [name] = process.argv.slice(2);
if (!name) throw new Error("You must include a component name.");

const dir = `${COMPONENTS_DIRECTORY}/${name}/`;

// throw an error if the file already exists
if (fs.existsSync(dir))
  throw new Error("A component with that name already exists.");

// create the folder
fs.mkdirSync(dir);

// component.tsx
fs.writeFile(`${dir}/${name}.tsx`, component(name), writeFileErrorHandler);
// component.scss
fs.writeFile(`${dir}/${name}.css`, "", writeFileErrorHandler);
// test.tsx
fs.writeFile(`${dir}/${name}.test.tsx`, test(name), writeFileErrorHandler);
// index.tsx
fs.writeFile(`${dir}/index.ts`, barrel(name), writeFileErrorHandler);

////////////////
/// Optional ///
////////////////

// insert new component into 'components/index.ts file
fs.readFile(`${COMPONENTS_DIRECTORY}/index.ts`, "utf8", (err, data) => {
  if (err) throw err;

  // grab all components and combine them with new component
  const currentComponents = data.match(/(?<=import )(.*?)(?= from)/g);
  // newComponents will return null if 'data' in './index.ts' is empty/new
  const newComponents = currentComponents
    ? [name, ...currentComponents].sort()
    : [name];

  // create the import and export statements
  const importStatements = newComponents
    .map((importName) => `import ${importName} from './${importName}';\n`)
    .join("");
  const exportStatements = `export {\n${newComponents
    .map((component) => `  ${component},\n`)
    .join("")}};\n`;

  const fileContent = `${importStatements}\n${exportStatements}`;

  fs.writeFile(
    `${COMPONENTS_DIRECTORY}/index.ts`,
    fileContent,
    writeFileErrorHandler
  );
});
