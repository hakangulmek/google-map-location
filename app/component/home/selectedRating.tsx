import Data from "@/data/data";
import React, { useState } from "react";

function SelectRating() {
  const [selectedRating, setSelectedRating] = useState<string[]>([]);

  const onSelectRating = (isChecked: boolean, value: string) => {
    if (isChecked) {
      setSelectedRating([...selectedRating, value]);
    } else {
      setSelectedRating(selectedRating.filter((n) => n !== value));
    }
    console.log(selectedRating);
  };
  return (
    <div className="px-2 mt-5">
      <h2 className="font-bold">Select Rating</h2>
      <div>
        {Data.ratingList.map((item, index) => (
          <div key={index} className="flex justify-between">
            <label>{item.icon}</label>
            <input
              type="checkbox"
              onChange={(e) =>
                onSelectRating(e.target.checked, String(item.name))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectRating;
