import { FileSearch } from "lucide-react";

export default function NoDataFound({
  title = "No Data Found",
  description = "No records available at the moment.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
        <FileSearch size={38} className="text-[#0B4EA2]" />
      </div>

      <h3 className="text-xl font-semibold text-gray-700">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 text-center">
        {description}
      </p>
    </div>
  );
}