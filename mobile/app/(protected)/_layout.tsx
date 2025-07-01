import { Stack } from "expo-router";

export default function RootLayout() {
  // if (!isLogin) {
  //   return <Redirect href={"/login"} />;
  // }
  return <Stack screenOptions={{ headerShown: false }} />;
}
