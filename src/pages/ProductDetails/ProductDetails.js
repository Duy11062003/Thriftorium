// src/pages/ProductDetails/ProductDetails.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(0); // state cho review stars

  useEffect(() => {
    const titleFromSlug = slug
      ? slug.replace(/[-_]/g, " ").trim()
      : "Có Hai Con Mèo Ngồi Bên Cửa Sổ";
    setProduct({
      title: titleFromSlug,
      author: "Nguyễn Nhật Ánh",
      price: "42.000 VND",
      rating: 5,
      views: 32,
      description: [
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
        "Lorem ipsum dolor sit amet consectetur.",
        "Lorem ipsum dolor sit amet consectetur.",
        "Lorem ipsum dolor sit amet consectetur.",
      ],
      images: [
        "bestSellerOne.webp",
        "bestSellerTwo.webp",
        "bestSellerThree.webp",
        "bestSellerFour.webp",
      ],
    });
  }, [slug]);

  if (!product) return <div className="p-8 text-center">Loading…</div>;
  const { title, author, price, rating, views, description, images } = product;
  const [mainImage, ...thumbs] = images;

  const importImg = (file) => {
    try {
      return require(`../../assets/images/products/bestSeller/${file}`);
    } catch {
      return "";
    }
  };
  const importAsset = (file) => {
    try {
      return require(`../../assets/images/${file}`);
    } catch {
      return "";
    }
  };

  const stars = (count) =>
    Array.from({ length: 5 }, (_, i) =>
      i < count ? (
        <FaStar key={i} className="inline text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="inline text-gray-300" />
      )
    );

  const sampleReviews = [
    {
      name: "Kara",
      avatar: importAsset("logoLight.png"),
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis malesuada dui, id fringilla lectus. In auctor mauris in turpis convallis, non blandit augue sollicitudin. Integer consectetur, turpis eget scelerisque lacinia.",
      rating: 5,
    },
    {
      name: "Kim",
      avatar: importAsset("orebiLogo.png"),
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis malesuada dui, id fringilla lectus. In auctor mauris in turpis convallis, non blandit augue sollicitudin. Integer consectetur, turpis eget scelerisque lacinia.",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-container mx-auto px-4 pt-6">
        {/* Header */}
        <h1 className="text-4xl italic font-bold">Product</h1>
        <p className="text-sm text-gray-600 mt-1 mb-2">
          /product listing/{title} – {author}
        </p>

        {/* Gallery + Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-6">
          {/* Thumbnails */}
          <div className="hidden md:grid md:col-span-1 md:row-span-3 grid grid-rows-3 gap-4 h-full">
            {thumbs.slice(0, 3).map((f, i) => (
              <img
                key={i}
                src={importImg(f)}
                alt={`thumb-${i}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Main image */}
          <div className="md:col-span-3 md:row-span-3 bg-gray-100 rounded-lg overflow-hidden">
            {mainImage ? (
              <img
                src={importImg(mainImage)}
                alt="main"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 p-8 text-center">No image</div>
            )}
          </div>

          {/* Info & Actions */}
          <div className="md:col-span-2 md:row-span-3 flex flex-col">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {title} – {author}
              </h2>
              <div className="flex items-center space-x-2 text-sm mb-4">
                <span className="text-xl font-semibold text-red-600">
                  {price}
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center space-x-1">
                  {stars(rating)}
                </span>
                <span className="text-gray-500">| {views} view</span>
              </div>
              <p className="text-gray-700 mb-2">{description[0]}</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                {description.slice(1).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="inline-flex items-center h-12 bg-black text-white rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-5"
                >
                  –
                </button>
                <span className="px-6">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-5"
                >
                  +
                </button>
              </div>
              <button className="flex-1 h-12 bg-red-600 text-white px-6 rounded-lg hover:bg-red-700 transition">
                Add to Cart
              </button>
            </div>

            {/* Buy Now */}
            <button className="w-full h-12 bg-black text-white px-6 rounded-lg hover:bg-gray-800 transition">
              Buy Now
            </button>
          </div>
        </div>

        {/* Shop Info Block */}
        <div className="mt-8 flex items-center justify-between p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <img
              src={importAsset("logoLight.png")}
              alt="Shop Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="text-lg font-semibold">Shop Lí Lắc</div>
              <div className="flex items-center space-x-2 text-sm">
                {stars(5)}
                <span className="none">138</span>
                <span className="flex items-center space-x-1 text-green-600 font-medium">
                  <FaCheckCircle /> Verified account
                </span>
              </div>
              <div className="text-sm text-gray-600">
                0 Followers  191 Following
              </div>
            </div>
          </div>
          <button className="h-10 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Follow
          </button>
        </div>

        {/* Description | Reviews */}
        <div className="mt-10 mb-12">
          <h3 className="text-xl font-semibold mb-4">Description | Reviews</h3>
          <p className="mb-4 text-gray-700">
            Donec auctor, justo nec ullamcorper elementum, dui turpis efficitur ante,
            nec tempus justo lorem in lectus. Etiam viverra maximus erat, ut volutpat
            justo convallis a. Aliquam erat volutpat. Nulla facilisi.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
            <li>Lorem ipsum dolor sit amet consectetur.</li>
            <li>Nam tincidunt, dui vel facilisis auctor...</li>
            <li>Nunc viverra convallis ante sit amet consequat...</li>
            <li>Mauris at ullamcorper libero...</li>
          </ul>

          {sampleReviews.map((rev, idx) => (
            <div
              key={idx}
              className="mb-4 border border-gray-300 rounded-lg p-4 flex space-x-4"
            >
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold mb-1">{rev.name}</div>
                <p className="text-sm text-gray-700 mb-2">{rev.text}</p>
                <div className="flex justify-between items-center">
                  <div className="space-x-1">{stars(rev.rating)}</div>
                  <div className="space-x-4 text-sm text-gray-500">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Review Form */}
          <div className="border border-gray-300 rounded-lg p-6 mt-6">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={importAsset("orebiLogo.png")}
                alt="You"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
                      placeholder="Bui Khanh Duy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Your Email:
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm"
                      placeholder="duy@gmail.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Your Review:
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm h-24"
                      placeholder="Your review…"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Your Ratings + Post Review */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Your Ratings:</span>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className={`cursor-pointer text-xl ${
                        i < reviewRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <button className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Post Review <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
