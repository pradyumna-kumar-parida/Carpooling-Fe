import { IoLocationOutline, IoCloudUploadOutline } from "react-icons/io5";
import { CiMail, CiGlobe } from "react-icons/ci";
import { FiUser, FiUsers } from "react-icons/fi";
import { LiaPhoneSolid } from "react-icons/lia";
import { RxLockClosed } from "react-icons/rx";
import { PiBankLight, PiHashStraightLight } from "react-icons/pi";

export const ICONS = {
  user: FiUser,
  email: CiMail,
  phone: LiaPhoneSolid,
  group: FiUsers,
  lock: RxLockClosed,
  map: IoLocationOutline,
  bank: PiBankLight,
  hash: PiHashStraightLight,
  globe: CiGlobe,
  upload: IoCloudUploadOutline,
};

export const DRIVER_STEPS = [
  {
    title: "Basic Details",
    subtitle: "Tell us where you're based",
    fields: ["city", "state", "country", "postalCode", "address"],
  },
  {
    title: "Bank Details",
    subtitle: "For secure earnings transfer",
    fields: [
      "bankAccountHolder",
      "bankAccountNumber",
      "bankIFSC",
      "bankBranchName",
    ],
  },
  {
    title: "Upload Documents",
    subtitle: "Required for driver verification",
    fields: [
      "driverLicense",
      "aadhaarCard",
      "panCard",
      "bankAccountDetails",
      "profilePicture",
    ],
  },
];

export const FILE_FIELDS = new Set([
  "driverLicense",
  "aadhaarCard",
  "panCard",
  "bankAccountDetails",
  "profilePicture",
]);

export const FIELD_META = {
  city: {
    label: "City",
    icon: ICONS.map,
    type: "text",
    placeholder: "Enter your city",
  },
  state: {
    label: "State",
    icon: ICONS.map,
    type: "text",
    placeholder: "Enter your state",
  },
  country: {
    label: "Country",
    icon: ICONS.globe,
    type: "text",
    placeholder: "Enter your country",
  },
  postalCode: {
    label: "Postal Code",
    icon: ICONS.hash,
    type: "text",
    placeholder: "Enter postal code",
  },
  address: {
    label: "Address",
    icon: ICONS.map,
    type: "text",
    placeholder: "Enter your full address",
  },
  bankAccountHolder: {
    label: "Account Holder Name",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Name on bank account",
  },
  bankAccountNumber: {
    label: "Bank Account Number",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Enter account number",
  },
  bankIFSC: {
    label: "Bank IFSC Code",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Enter IFSC code",
  },
  bankBranchName: {
    label: "Bank Name",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Enter bank name",
  },
  driverLicense: {
    label: "Driving License",
  },
  aadhaarCard: {
    label: "Aadhaar Card",
  },
  panCard: {
    label: "PAN Card",
  },
  bankAccountDetails: {
    label: "Bank Account Details",
  },
  profilePicture: {
    label: "Profile Picture",
  },
};

export const INITIAL_FORM = {
  fullname: "",
  email: "",
  phone: "",
  usertype: "",
  password: "",
  confirmPassword: "",
  terms: false,

  city: "",
  state: "",
  country: "",
  postalCode: "",
  address: "",

  bankAccountHolder: "",
  bankAccountNumber: "",
  bankIFSC: "",
  bankBranchName: "",

  driverLicense: null,
  aadhaarCard: null,
  panCard: null,
  bankAccountDetails: null,
  profilePicture: null,
};
