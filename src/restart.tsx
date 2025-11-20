import { Alert, confirmAlert, showToast, Toast } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";

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
    await runAppleScript(`
    tell application "Raycast" to quit
    delay 0.5
    tell application "Raycast" to activate
  `);
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to restart Raycast",
    });
    console.error("Failed to restart Raycast:", error);
  }
}
