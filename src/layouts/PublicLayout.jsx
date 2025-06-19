import Footer from "../components/home/Footer/Footer";
import FooterBottom from "../components/home/Footer/FooterBottom";
import Header from "../components/home/Header/Header";
import HeaderBottom from "../components/home/Header/HeaderBottom";
import SpecialCase from "../components/SpecialCase/SpecialCase";

const PublicLayout = ({ children }) => {
  return (
    <div className="font-bodyFont">
      <Header />
      <HeaderBottom />
      <SpecialCase />
      {children}
      <Footer />
      <FooterBottom />
    </div>
  );
};

export default PublicLayout;
