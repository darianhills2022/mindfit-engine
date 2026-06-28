export const metadata = {
  title: "MindFit Academy",
  description: "Mental fitness, guided by your therapist.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
