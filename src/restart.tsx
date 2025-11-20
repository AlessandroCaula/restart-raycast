import { Alert, confirmAlert } from "@raycast/api";
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

  await runAppleScript(`
    tell application "Raycast" to quit
    delay 0.3
    tell application "Raycast" to activate
  `);
}
