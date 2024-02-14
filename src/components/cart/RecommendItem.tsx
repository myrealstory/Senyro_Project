import sampleImage from "../../../images/icons/SampleImages@3x.png";
import Image from "next/image";

export default function RecommendItem() {
  return (
    <li className="text-[#6A1648]">
      <div>
        <Image src={sampleImage} alt="" />
      </div>
    </li>
  );
}
