import { Analytics } from '@vercel/analytics/next'
import { Bricolage_Grotesque, JetBrains_Mono, Noto_Sans_KR } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '짤기억 (Mem-Pop) | 단어를 짤처럼, 기억은 팝하게!',
  description: '외우기 힘든 단어·개념·연도를 단 한 줄로! 뇌리에 팍 꽂히는 3줄 스토리와 3지선다 1초 퀴즈 AI 튜터',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFD600',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${bricolage.variable} ${jetbrainsMono.variable} ${notoSansKr.variable}`}
    >
      <body className="min-h-screen bg-[#FFF8EF] text-[#1A1C1E] font-sans antialiased selection:bg-[#FFD600] selection:text-[#1A1C1E]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
