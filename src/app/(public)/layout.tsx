import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HashScrollHandler from '@/components/common/HashScrollHandler'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <HashScrollHandler />
      {children}
      <Footer />
    </>
  )
}

