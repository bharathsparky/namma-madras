import { Redirect } from 'expo-router';

/** Static route: `/category/learn` always opens the hub (avoids stale `[slug]` matches). */
export default function CategoryLearnRedirect() {
  return <Redirect href="/hub/learn" />;
}
