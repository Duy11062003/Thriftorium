// src/pages/About/About.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

export default function About() {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    if (location.state && location.state.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4 py-10">
      {/* Breadcrumb + Title */}
      <Breadcrumbs title="Về chúng tôi" prevLocation={prevLocation} />

      {/* Content Card */}
      <div className="bg-gray-100 rounded-lg p-8 space-y-8">
        {/* Section: Chào mừng */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Chào Mừng Đến Với Công Ty Chúng Tôi
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi là một công ty chuyên cung cấp giải pháp công nghệ thông tin, với sứ mệnh mang lại giá trị tối ưu cho khách hàng và cộng đồng. Chúng tôi không ngừng phát triển và đổi mới để đáp ứng nhu cầu ngày càng cao của thị trường. Đội ngũ của chúng tôi luôn làm việc hết mình để mang đến những giải pháp sáng tạo và hiệu quả nhất cho khách hàng.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Với nhiều năm kinh nghiệm trong ngành công nghiệp, chúng tôi đã xây dựng được mối quan hệ tốt với các đối tác và khách hàng. Chúng tôi cam kết cung cấp dịch vụ chuyên nghiệp và tận tâm, đảm bảo mỗi sản phẩm đem tới khách hàng đều đạt tiêu chuẩn cao nhất.
          </p>
        </section>

        {/* Section: Sứ Mệnh */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Sứ Mệnh Của Chúng Tôi
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Đem đến những sản phẩm và dịch vụ chất lượng cao, phục vụ nhu cầu của khách hàng một cách nhanh chóng và hiệu quả nhất. Chúng tôi không ngừng nỗ lực để cải tiến và nâng cao chất lượng dịch vụ của mình, nhằm đem lại sự hài lòng tối đa cho khách hàng.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi tin rằng công nghệ là một công cụ mạnh mẽ để giúp thay đổi cuộc sống. Do đó, sứ mệnh của chúng tôi còn là tạo ra những sản phẩm đổi mới, mang lại giá trị bền vững cho cộng đồng và môi trường.
          </p>
          <p className="text-gray-700 leading-relaxed italic">
            “Bằng cách phát triển các giải pháp phát triển xanh và bền vững, chúng tôi hy vọng sẽ góp phần vào việc bảo vệ môi trường và xây dựng một xã hội tốt đẹp hơn.”
          </p>
        </section>

        {/* Section: Liên hệ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Liên Hệ Chúng Tôi
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Nếu bạn có bất kỳ câu hỏi nào về sản phẩm hoặc dịch vụ của chúng tôi, vui lòng liên hệ với chúng tôi qua email hoặc điện thoại. Chúng tôi rất mong nhận được phản hồi từ bạn.
          </p>
          <p className="text-gray-700">
            Email: <a href="mailto:contact@company.com" className="text-primeColor hover:underline">contact@company.com</a>  
            <br />
            Điện thoại: <a href="tel:0123456789" className="text-primeColor hover:underline">012 345 6789</a>
          </p>
        </section>
      </div>
    </div>
);
}
