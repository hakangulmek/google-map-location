import React, { useState } from "react";
import Data from "./../../../data/data";
function categoryList() {
  const [categories, setCategories] = useState(Data.CategoryListData);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col
                justify-center items-center bg-gray-100
                p-2 m-2 rounded-lg grayscale 
                hover:grayscale-0 cursor-pointer
                text-[13px]
                 border-purple-400
                ${
                  selectedCategory == index ? "grayscale-0 border-[1px]" : null
                }`}
            onClick={() => {
              setSelectedCategory(index);
            }}
          >
            <img src={item.icon} alt={item.name} width={36} height={36} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default categoryList;
