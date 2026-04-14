#!/usr/bin/env bash
# Reliable Play Store screenshots from Android emulator:
# - Cold-starts into each deep link (CLEAR_TASK|NEW_TASK) so Expo Router actually shows that screen.
# - Disables window animations so the UI settles faster.
#
# Why screenshots sometimes look like an "old" build while the app looks fine interactively:
#   Debug builds prefer loading JS from Metro on your machine (localhost:8081 → emulator via adb reverse).
#   If Metro is not running or reverse is not set, the app falls back to the bundle BAKED INTO THE APK
#   at last assemble — that UI can be much older than what you see with `expo start`.
#   This script runs `adb reverse tcp:8081 tcp:8081` and warns if nothing is listening on 8081.
#
# Options:
#   CAPTURE_SKIP_METRO=1  — skip adb reverse (you only want embedded bundle, e.g. after rebuilding APK).
#
# Embedded bundle matches latest code without Metro:
#   cd android && ./gradlew :app:createBundleReleaseJsAndAssets --rerun-tasks assembleDebug
#   adb install -r app/build/outputs/apk/debug/app-debug.apk
#
# Usage: connect emulator, then: ./scripts/capture-emulator-play-store.sh
# Requires: adb in PATH (e.g. Android SDK platform-tools).

set -euo pipefail
export PATH="${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools:/opt/homebrew/share/android-commandlinetools/platform-tools:$PATH"

PKG="com.nammamadras.app"
OUT="${1:-$(dirname "$0")/../assets/play-store-screenshots}"
mkdir -p "$OUT"

adb devices | grep -q "device$" || { echo "No device/emulator connected."; exit 1; }

# Same JS as interactive dev: Metro on host → emulator (must match expo start port, default 8081).
if [[ "${CAPTURE_SKIP_METRO:-}" != "1" ]]; then
  adb reverse tcp:8081 tcp:8081 2>/dev/null || true
  if ! (echo >/dev/tcp/127.0.0.1/8081) 2>/dev/null; then
    echo "WARNING: Nothing accepting connections on 127.0.0.1:8081 — screenshots will use the APK-embedded JS (often older UI)."
    echo "         Fix: in another terminal run: npx expo start   (then re-run this script)"
  else
    echo "Metro reachable on :8081 — cold starts should match your current dev UI."
  fi
fi

# Optional: speed up transitions (restore at end)
ANIM_WINDOW=$(adb shell settings get global window_animation_scale 2>/dev/null | tr -d '\r' || echo 1)
ANIM_TRANS=$(adb shell settings get global transition_animation_scale 2>/dev/null | tr -d '\r' || echo 1)
ANIM_DUR=$(adb shell settings get global animator_duration_scale 2>/dev/null | tr -d '\r' || echo 1)
cleanup() {
  adb shell settings put global window_animation_scale "${ANIM_WINDOW:-1}" 2>/dev/null || true
  adb shell settings put global transition_animation_scale "${ANIM_TRANS:-1}" 2>/dev/null || true
  adb shell settings put global animator_duration_scale "${ANIM_DUR:-1}" 2>/dev/null || true
}
trap cleanup EXIT

adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0

# FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_CLEAR_TASK — fresh task so linking opens the right route.
FLAGS=0x10008000

capture() {
  local name="$1"
  local uri="$2"
  echo "=== ${name} (${uri}) ==="
  adb shell am force-stop "$PKG"
  sleep 1
  adb shell am start -W -a android.intent.action.VIEW -d "$uri" -f "$FLAGS" "$PKG"
  # First paint + SQLite / fonts after cold start
  sleep 22
  adb shell screencap -p "/sdcard/cap_${name}.png"
  adb pull "/sdcard/cap_${name}.png" "${OUT}/${name}.png"
  ls -la "${OUT}/${name}.png"
}

capture "home" "namma-madras://"
capture "stay" "namma-madras://hub/stay"
capture "medical" "namma-madras://hub/medical"
capture "work" "namma-madras://hub/work"
capture "hygiene" "namma-madras://hub/hygiene"
capture "emergency" "namma-madras://emergency"

echo "Done. Screenshots in: $OUT"
echo "If any screen still looks wrong, open that screen manually and use the emulator camera button — it always matches what you see."
