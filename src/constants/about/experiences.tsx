import ExpImage from "@/images/samplePic/about_square.png";
import Image from "next/image";

import { ReactNode } from "react";

interface Experience {
  image: ReactNode;
  title: string;
  content: string;
}

export const experiences: Experience[] = [
  {
    image: <Image src={ExpImage} width={0} height={0} alt="Experience " />,
    title: "Experience demo",
    content:
      "Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh.",
  },
  {
    image: <Image src={ExpImage} width={0} height={0} alt="Experience " />,
    title: "Experience demo",
    content:
      "Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh.",
  },
  {
    image: <Image src={ExpImage} width={0} height={0} alt="Experience " />,
    title: "Experience demo",
    content:
      "Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh.",
  },
];
