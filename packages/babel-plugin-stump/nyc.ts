import { loadNycConfig } from "@istanbuljs/load-nyc-config";

async function main() {
  const [cwd, nycrcPath] = process.argv.slice(2);

  console.log(JSON.stringify(await loadNycConfig({ cwd, nycrcPath })));
}

main().catch((error) => {
  console.log(JSON.stringify({ "load-nyc-config-sync-error": error.message }));
});
