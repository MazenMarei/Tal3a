// import { useQueryClient } from "@tanstack/react-query";
// import { user_canister } from "declarations/user_canister";
// import { userQueryKeys } from "./useUserQueries";
// import type { User } from "declarations/user_canister/user_canister.did";

// // Custom hook for managing query cache
// export const useUserQueryUtils = () => {
//   const queryClient = useQueryClient();

//   // Prefetch governorates (useful for forms)
//   const prefetchGovernorates = async () => {
//     await queryClient.prefetchQuery({
//       queryKey: userQueryKeys.governorates(),
//       queryFn: async () => {
//         return await user_canister.get_all_governorates();
//       },
//       staleTime: 30 * 60 * 1000,
//     });
//   };

//   // Invalidate all user-related queries
//   const invalidateAllUserQueries = () => {
//     queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
//   };

//   // Clear all user data (useful on logout)
//   const clearUserCache = () => {
//     queryClient.removeQueries({ queryKey: userQueryKeys.all });
//   };

//   // Optimistically update current user
//   const optimisticUpdateCurrentUser = (
//     updater: (oldData: User | undefined) => User
//   ) => {
//     queryClient.setQueryData(userQueryKeys.currentUser(), updater);
//   };

//   return {
//     prefetchGovernorates,
//     invalidateAllUserQueries,
//     clearUserCache,
//     optimisticUpdateCurrentUser,
//   };
// };
