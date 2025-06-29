import Header from "../components/home/Header/Header";
import HeaderBottom from "../components/home/Header/HeaderBottom";
import Footer from "../components/home/Footer/Footer";
import SpecialCase from "../components/SpecialCase/SpecialCase";
import FooterBottom from "../components/home/Footer/FooterBottom";

const ProfileLayout = ({ children }) => (
  <div className="bg-gray-50 min-h-screen py-10">
    <Header />
    <HeaderBottom />
    <SpecialCase />
    <div className="max-w-container mx-auto px-4">{children}</div>
    <Footer />
    <FooterBottom />
  </div>
);
export default ProfileLayout;
