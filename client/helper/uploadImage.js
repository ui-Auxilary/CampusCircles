import { BASE_URL } from "@/constants/api";
import axios from "axios";

export const uploadImage = async (id, data) => {
  return await axios
    .post(`${BASE_URL}/users/upload/${id}`, data)
    .then((data) => data)
    .catch((e) => console.log(e));
};
