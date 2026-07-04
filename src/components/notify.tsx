import type { StaticImageData } from "next/image";

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  time: string;
  img: StaticImageData;
  read: boolean;
};
