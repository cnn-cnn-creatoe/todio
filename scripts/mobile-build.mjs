import { execSync } from "node:child_process";
import { platform } from "node:os";

const target = process.argv[2];

const run = (command) => {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit" });
};

const die = (message) => {
  console.error(message);
  process.exit(1);
};

if (!target) {
  die("Usage: node scripts/mobile-build.mjs <add|sync|android|ios>");
}

switch (target) {
  case "add":
    run("npx cap add android");
    run("npx cap add ios");
    break;
  case "sync":
    run("npm run build");
    run("npx cap sync");
    break;
  case "android":
    run("npm run build");
    run("npx cap sync android");
    run("npx cap open android");
    break;
  case "ios":
    if (platform() !== "darwin") {
      die("iOS 构建需要在 macOS 上运行，并安装 Xcode。");
    }
    run("npm run build");
    run("npx cap sync ios");
    run("npx cap open ios");
    break;
  default:
    die("Unknown target. Use: add | sync | android | ios");
}
