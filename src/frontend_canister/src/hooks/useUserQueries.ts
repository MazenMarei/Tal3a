// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { user_canister } from "declarations/user_canister";
// import { Principal } from "@dfinity/principal";
// import { useAuthContext } from "@/contexts/AuthContext";
// import type {
//   User,
//   PublicUser,
//   GovernorateData,
//   CityData,
//   RegisteringUser,
//   UpdatingUser,
//   UserActivity,
//   NewNotification,
// } from "declarations/user_canister/user_canister.did";
// import { getUserActor } from "@/services";

// // Query Keys - Centralize your query keys
// export const userQueryKeys = {
//   all: ["users"] as const,
//   user: (id: string) => [...userQueryKeys.all, "user", id] as const,
//   currentUser: () => [...userQueryKeys.all, "current"] as const,
//   governorates: () => [...userQueryKeys.all, "governorates"] as const,
//   cities: (governorateId: number) =>
//     [...userQueryKeys.all, "cities", governorateId] as const,
//   governorate: (id: number) =>
//     [...userQueryKeys.all, "governorate", id] as const,
//   city: (cityId: number, governorateId: number) =>
//     [...userQueryKeys.all, "city", cityId, governorateId] as const,
// } as const;

// // Get all governorates (public data)
// export const useGovernorates = () => {
//   return useQuery({
//     queryKey: userQueryKeys.governorates(),
//     queryFn: async (): Promise<GovernorateData[]> => {
//       return await user_canister.get_all_governorates();
//     },
//     staleTime: 30 * 60 * 1000, // 30 minutes - governorates don't change often
//   });
// };

// // Get cities in a governorate (public data)
// export const useCitiesInGovernorate = (governorateId: number) => {
//   return useQuery({
//     queryKey: userQueryKeys.cities(governorateId),
//     queryFn: async (): Promise<CityData[]> => {
//       return await user_canister.get_all_cities_in_governorate(governorateId);
//     },
//     enabled: governorateId > 0,
//     staleTime: 30 * 60 * 1000, // Cities don't change often
//   });
// };

// // Get specific governorate
// export const useGovernorate = (governorateId: number) => {
//   return useQuery({
//     queryKey: userQueryKeys.governorate(governorateId),
//     queryFn: async (): Promise<GovernorateData> => {
//       const result = await user_canister.get_governorate(governorateId);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to fetch governorate");
//     },
//     enabled: governorateId > 0,
//   });
// };

// // Get specific city
// export const useCity = (cityId: number, governorateId: number) => {
//   return useQuery({
//     queryKey: userQueryKeys.city(cityId, governorateId),
//     queryFn: async (): Promise<CityData> => {
//       const result = await user_canister.get_city(cityId, governorateId);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to fetch city");
//     },
//     enabled: cityId > 0 && governorateId > 0,
//   });
// };

// // Get current user (authenticated)
// export const useCurrentUser = () => {
//   const { user: authUser } = useAuthContext();

//   return useQuery({
//     queryKey: userQueryKeys.currentUser(),
//     queryFn: async (): Promise<User> => {
//       const userActor = await getUserActor();
//       if (!userActor) {
//         throw new Error(
//           "User actor not initialized. Call initIdentity() first."
//         );
//       }
//       const result = await userActor.get_current_user();
//       console.log(result);

//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to fetch current user");
//     },
//     refetchInterval: 10000, // Refetch every 10 seconds
//     enabled: !!authUser, // Only run when user is authenticated
//   });
// };

// // Get specific user by principal (public data)
// export const useUser = (principalString: string) => {
//   return useQuery({
//     queryKey: userQueryKeys.user(principalString),
//     queryFn: async (): Promise<PublicUser> => {
//       const principal = Principal.fromText(principalString);
//       const result = await user_canister.get_user(principal);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to fetch user");
//     },
//     enabled: !!principalString,
//   });
// };

// // MUTATIONS

// // Create user mutation
// export const useCreateUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (userData: RegisteringUser): Promise<User> => {
//       let actor = await getUserActor();
//       if (!actor) {
//         throw new Error(
//           "User actor not initialized. Call initIdentity() first."
//         );
//       }
//       const result = await actor.create_user(userData);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to create user");
//     },
//     onSuccess: (data) => {
//       // Update current user query
//       queryClient.setQueryData(userQueryKeys.currentUser(), data);

//       // Invalidate user-related queries
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
//     },
//     onError: (error) => {
//       console.error("Failed to create user:", error);
//     },
//   });
// };

// // Update user profile mutation
// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (userData: UpdatingUser) => {
//       let actor = await getUserActor();
//       if (!actor) {
//         throw new Error(
//           "User actor not initialized. Call initIdentity() first."
//         );
//       }
//       const result = await actor.update_profile(userData);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to update profile");
//     },
//     onSuccess: () => {
//       // Invalidate current user query to refetch updated data
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });
// };

// // Add activity mutation
// export const useAddActivity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (activity: UserActivity) => {
//       const result = await user_canister.add_activity(activity);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to add activity");
//     },
//     onSuccess: () => {
//       // Invalidate current user to refetch with new activity
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });
// };

// // Add notification mutation
// export const useAddNotification = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (notification: NewNotification) => {
//       const result = await user_canister.add_notification(notification);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to add notification");
//     },
//     onSuccess: () => {
//       // Invalidate current user to refetch with new notification
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });
// };

// // Mark notification as read mutation
// export const useMarkNotificationAsRead = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (notificationId: string) => {
//       const result = await user_canister.mark_notification_as_read(
//         notificationId
//       );
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(
//         result.Err?.message || "Failed to mark notification as read"
//       );
//     },
//     onSuccess: () => {
//       // Invalidate current user to refetch updated notifications
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });
// };

// // Delete account mutation
// export const useDeleteAccount = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async () => {
//       const result = await user_canister.delete_account();
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to delete account");
//     },
//     onSuccess: () => {
//       // Clear all user-related queries
//       queryClient.clear();
//     },
//   });
// };

// // Set account status mutation
// export const useSetAccountStatus = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (status: boolean) => {
//       const result = await user_canister.set_account_status(status);
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Failed to set account status");
//     },
//     onSuccess: () => {
//       // Invalidate current user to refetch updated status
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });
// };

// // Ping mutation (health check)
// export const usePing = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async () => {
//       let actor = await getUserActor();
//       if (!actor) {
//         throw new Error("User is not authenticated");
//       }
//       const result = await actor.ping();
//       if ("Ok" in result) {
//         return result.Ok;
//       }
//       throw new Error(result.Err?.message || "Ping failed");
//     },
//     onSuccess: () => {
//       // Invalidate current user query to refetch updated data
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });
// };
