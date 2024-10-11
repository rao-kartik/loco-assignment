import axios, { AxiosResponse } from "axios";

import { IFetchImagesArgs } from "./apiInterfaces";

export const fetchImagesApi = async (
  data: IFetchImagesArgs = { page: 1, per_page: 20 }
) => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      "https://api.unsplash.com/photos",
      {
        params: {
          client_id: process?.env?.NEXT_PUBLIC_ACCESS_KEY,
          ...data,
        },
      }
    );

    return response?.data;
  } catch (error) {
    throw error;
  }
};
