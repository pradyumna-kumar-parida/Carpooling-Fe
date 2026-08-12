import { CiMail } from "react-icons/ci";
import { FiUser, FiUsers } from "react-icons/fi";
import { LiaPhoneSolid } from "react-icons/lia";
import { RxLockClosed } from "react-icons/rx";

export const ICONS = {
  user: FiUser,
  email: CiMail,
  phone: LiaPhoneSolid,
  group: FiUsers,
  lock: RxLockClosed,
};

export const INITIAL_FORM = {
  fullname: "",
  email: "",
  phone: "",
  usertype: "",
  password: "",
  confirmPassword: "",
  terms: false,
};
