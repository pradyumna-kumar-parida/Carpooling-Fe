import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";


export default function WebsiteLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <BackToTop/>
      
            <Footer />
        </>
    );
}