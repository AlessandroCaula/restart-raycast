import { Alert, confirmAlert, showToast, Toast } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function main() {
  const confirmed = await confirmAlert({
    title: "Restart Raycast?",
    message: "This will quit and relaunch Raycast.",
    primaryAction: {
      title: "Restart",
      style: Alert.ActionStyle.Destructive,
    },
  });

  if (!confirmed) return;

  try {
    const osType = process.platform;

    if (osType === "darwin") {
      // macOS
      await runAppleScript(`
        tell application "Raycast" to quit
        delay 0.5
        tell application "Raycast" to activate
      `);
    } else if (osType === "win32") {
      // Windows
      await execAsync('taskkill /F /IM "Raycast.exe"');

      await new Promise((resolve) => setTimeout(resolve, 500));

      const paths = [
        `"${process.env.LOCALAPPDATA}\\Programs\\Raycast\\Raycast.exe"`,
        `"${process.env.PROGRAMFILES}\\Raycast\\Raycast.exe"`,
      ];

      let started = false;
      for (const path of paths) {
        try {
          await execAsync(`start "" /B ${path}`);
          started = true;
          break;
        } catch {
          // try next path
          continue;
        }
      }

      if (!started) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not find Raycast",
          message: "Please restart manually",
        });
      }
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "OS not supported",
        message: `${osType} is not supported`,
      });
    }
    await showToast({ style: Toast.Style.Success, title: "Raycast restarted!" });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to restart Raycast",
    });
    console.error("Failed to restart Raycast:", error);
  }
}
