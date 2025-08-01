import { Loading } from "@/components/ui";
import { useAuth } from "@/context/auth";
import { Redirect } from "expo-router";

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
