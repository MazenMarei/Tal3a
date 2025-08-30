import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCity } from "@/services/city";
import {
  getAllGovernorateCities,
  getAllGovernorates,
  getGovernorate,
} from "@/services/governorate";

export const useAllGovernorates = () => {
  return useQuery({
    queryKey: ["governorates"],
    queryFn: getAllGovernorates,
  });
};

export const useGovernorate = (governorateId: number) => {
  return useQuery({
    queryKey: ["governorate", governorateId],
    queryFn: () => getGovernorate(governorateId),
  });
};

export const useAllGovernorateCities = (governorateId: number) => {
  return useQuery({
    queryKey: ["governorateCities", governorateId],
    queryFn: () => getAllGovernorateCities(governorateId),
  });
};

export const useCity = (cityId: number, governorateId: number) => {
  return useQuery({
    queryKey: ["city", cityId],
    queryFn: () => getCity(cityId, governorateId),
  });
};
