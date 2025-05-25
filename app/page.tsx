"use client";
import CategoryList from "./component/home/categoryList";
import RangeSelect from "./component/home/rangeSelect";
import SelectRating from "./component/home/selectedRating";

export default function Home() {
  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="p-2">
        <CategoryList />
        <RangeSelect />
        <SelectRating />
      </div>
      <div className="col-span-3">Second</div>
    </div>
  );
}
