export const metadata = {
  title: "Najiz | ناجز — منصتك للتحضير للشهادات المهنية",
  description: "منصة عربية للتحضير لشهادة PMP وشهادات مهنية أخرى — بنك أسئلة، امتحانات تجريبية، ونظام تركيز ذكي.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
