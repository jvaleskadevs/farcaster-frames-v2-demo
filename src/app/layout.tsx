import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSession } from "~/auth";
import "~/app/globals.css";
import { Providers } from "~/app/providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const frame = {
  version: "next",
  imageUrl: `https://farcaster-frames-v2-demo.vercel.app/opengraph-image`,
  button: {
    title: "Learn",
    action: {
      type: "launch_frame",
      name: "Farcaster Frames V2 Demo",
      url: "https://farcaster-frames-v2-demo.vercel.app",
      splashImageUrl: "https://farcaster-frames-v2-demo.vercel.app/logo.png",
      splashBackgroundColor: "#000",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Farcaster Frames V2 Demo",
    openGraph: {
      title: "Farcaster Frames V2 Demo",
      description: "The ultimate learning tool for building v2 frames.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
