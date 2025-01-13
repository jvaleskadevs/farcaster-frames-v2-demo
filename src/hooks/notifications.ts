import { useQuery } from "@tanstack/react-query";

export function useNotificationToken({ app, fid }: { app?: string, fid?: number }) {
  return useQuery({
    queryKey: ["notification-token"],
    queryFn: async () => {
      const res = await fetch(`/api/notis/has-token?app=${app}&fid=${fid}`);
      return res.json();
    },
    enabled: !!fid && !!app,
  });
}
