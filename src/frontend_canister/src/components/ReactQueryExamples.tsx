// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { user_canister } from "declarations/user_canister";
// import {
//   useGovernorates,
//   useCitiesInGovernorate,
//   useCurrentUser,
//   useCreateUser,
//   useUpdateProfile,
//   userQueryKeys,
//   usePing,
// } from "@/hooks/useUserQueries";
// import { useAuthContext } from "@/contexts/AuthContext";

// export const ReactQueryExamples: React.FC = () => {
//   const { user: authUser } = useAuthContext();
//   const queryClient = useQueryClient();
//   const [selectedGovernorate, setSelectedGovernorate] = useState<number>(1);

//   // ========================================
//   // BASIC QUERIES
//   // ========================================

//   // 1. Simple query with loading/error states
//   const { data: governorates, isLoading, error, refetch } = useGovernorates();

//   // 2. Dependent query (cities depend on selected governorate)
//   const { data: cities, isFetching: citiesLoading } =
//     useCitiesInGovernorate(selectedGovernorate);

//   // 3. Conditional query (only runs when user is authenticated)
//   const { data: currentUser, isLoading: userLoading } = useCurrentUser();

//   // ========================================
//   // MUTATIONS
//   // ========================================

//   const createUserMutation = useCreateUser();
//   const updateProfileMutation = useUpdateProfile();
//   const pingMutation = usePing();
//   // ========================================
//   // ADVANCED PATTERNS
//   // ========================================

//   // 4. Manual query trigger (useful for search)
//   const [searchTerm, setSearchTerm] = useState("");
//   const {
//     data: searchResults,
//     isFetching: isSearching,
//     refetch: performSearch,
//   } = useQuery({
//     queryKey: ["users", "search", searchTerm],
//     queryFn: async () => {
//       // This would be a search method in your canister
//       // const result = await user_canister.search_users(searchTerm);
//       // For now, return empty array
//       return [];
//     },
//     enabled: false, // Don't run automatically
//   });

//   // 5. Optimistic updates
//   const optimisticUpdateMutation = useMutation({
//     mutationFn: async (newUsername: string) => {
//       // This would call your update method
//       throw new Error("Not implemented yet");
//     },
//     onMutate: async (newUsername) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({
//         queryKey: userQueryKeys.currentUser(),
//       });

//       // Snapshot the previous value
//       const previousUser = queryClient.getQueryData(
//         userQueryKeys.currentUser()
//       );

//       // Optimistically update to the new value
//       if (previousUser) {
//         queryClient.setQueryData(userQueryKeys.currentUser(), {
//           ...previousUser,
//           username: newUsername,
//         });
//       }

//       // Return a context object with the snapshotted value
//       return { previousUser };
//     },
//     onError: (err, newUsername, context) => {
//       // If the mutation fails, use the context returned from onMutate to roll back
//       if (context?.previousUser) {
//         queryClient.setQueryData(
//           userQueryKeys.currentUser(),
//           context.previousUser
//         );
//       }
//     },
//     onSettled: () => {
//       // Always refetch after error or success
//       queryClient.invalidateQueries({ queryKey: userQueryKeys.currentUser() });
//     },
//   });

//   // ========================================
//   // EVENT HANDLERS
//   // ========================================

//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       performSearch();
//     }
//   };

//   const handlePrefetchData = () => {
//     // Prefetch data before user needs it
//     queryClient.prefetchQuery({
//       queryKey: userQueryKeys.cities(selectedGovernorate),
//       queryFn: async () => {
//         return await user_canister.get_all_cities_in_governorate(
//           selectedGovernorate
//         );
//       },
//     });
//   };

//   // ========================================
//   // RENDER
//   // ========================================

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold">
//         React Query Best Practices Examples
//       </h1>

//       {/* Example 1: Basic Query with Loading States */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           1. Basic Query with States
//         </h2>
//         <div className="mb-4">
//           <button
//             onClick={() => refetch()}
//             className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//           >
//             Refetch Governorates
//           </button>
//           <button
//             onClick={() => {
//               queryClient.invalidateQueries({
//                 queryKey: userQueryKeys.governorates(),
//               });
//             }}
//             className="bg-purple-500 text-white px-4 py-2 rounded"
//           >
//             Invalidate Cache
//           </button>
//         </div>

//         {isLoading && <p>Loading governorates...</p>}
//         {error && <p className="text-red-500">Error: {error.message}</p>}
//         {governorates && (
//           <div className="grid grid-cols-3 gap-2">
//             {governorates.map((gov) => (
//               <div key={gov.id} className="border p-2 rounded">
//                 {gov.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Example 2: Dependent Queries */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">2. Dependent Queries</h2>
//         <div className="mb-4">
//           <label className="block mb-2">Select Governorate:</label>
//           <select
//             value={selectedGovernorate}
//             onChange={(e) => setSelectedGovernorate(Number(e.target.value))}
//             className="border rounded px-3 py-2"
//           >
//             {governorates?.map((gov) => (
//               <option key={gov.id} value={gov.id}>
//                 {gov.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {citiesLoading && <p>Loading cities...</p>}
//         {cities && (
//           <div className="grid grid-cols-4 gap-2">
//             {cities.slice(0, 8).map((city) => (
//               <div key={city.id} className="border p-2 rounded text-sm">
//                 {city.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Example 3: Authenticated Queries */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">3. Authenticated Data</h2>
//         {!authUser && (
//           <p className="text-gray-500">Please login to see your profile data</p>
//         )}

//         {userLoading && <p>Loading user profile...</p>}
//         {currentUser && (
//           <div className="bg-gray-50 p-4 rounded">
//             <p>
//               <strong>Username:</strong> {currentUser.username}
//             </p>
//             <p>
//               <strong>Role:</strong>{" "}
//               {"User" in currentUser.role ? "User" : "Admin"}
//             </p>
//             <p>
//               <strong>Online:</strong> {currentUser.is_online ? "Yes" : "No"}
//             </p>
//           </div>
//         )}
//       </section>

//       {/* Example 4: Manual Query Trigger */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">4. Manual Search Query</h2>
//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Enter search term..."
//             className="border rounded px-3 py-2 flex-1"
//           />
//           <button
//             onClick={handleSearch}
//             disabled={isSearching}
//             className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {isSearching ? "Searching..." : "Search"}
//           </button>
//         </div>

//         {searchResults && (
//           <p className="text-gray-500">Found {searchResults.length} results</p>
//         )}
//       </section>

//       {/* Example 5: Mutations with Loading States */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">5. Mutations</h2>
//         <div className="space-x-2 mb-4">
//           <button
//             onClick={() => {
//               createUserMutation.mutate({
//                 username: `user_${Date.now()}`,
//                 bio: ["Test user created via React Query"],
//                 governorate: 1,
//                 city: 1,
//                 sports: [{ Football: null }],
//                 avatar_url: [],
//                 free_days: [],
//               });
//             }}
//             disabled={createUserMutation.isPending}
//             className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {createUserMutation.isPending ? "Creating..." : "Create User"}
//           </button>

//           <button
//             onClick={() => {
//               updateProfileMutation.mutate({
//                 bio: [`Updated at ${new Date().toLocaleString()}`],
//                 username: [],
//                 city: [],
//                 governorate: [],
//                 sports: [],
//                 avatar_url: [],
//                 free_days: [],
//                 points: [],
//               });
//             }}
//             disabled={updateProfileMutation.isPending}
//             className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {updateProfileMutation.isPending ? "Updating..." : "Update Bio"}
//           </button>
//         </div>

//         {/* Show mutation errors */}
//         {createUserMutation.error && (
//           <p className="text-red-500 mt-2">
//             Create Error: {createUserMutation.error.message}
//           </p>
//         )}
//         {updateProfileMutation.error && (
//           <p className="text-red-500 mt-2">
//             Update Error: {updateProfileMutation.error.message}
//           </p>
//         )}

//         {/* Show success messages */}
//         {createUserMutation.isSuccess && (
//           <p className="text-green-500 mt-2">User created successfully!</p>
//         )}
//         {updateProfileMutation.isSuccess && (
//           <p className="text-green-500 mt-2">Profile updated successfully!</p>
//         )}
//       </section>

//       {/* Example 6: Cache Management */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">6. Cache Management</h2>
//         <div className="space-x-2">
//           <button
//             onClick={handlePrefetchData}
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Prefetch Cities
//           </button>

//           <button
//             onClick={() => {
//               queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
//             }}
//             className="bg-yellow-500 text-white px-4 py-2 rounded"
//           >
//             Invalidate All User Queries
//           </button>

//           <button
//             onClick={() => {
//               queryClient.clear();
//             }}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Clear All Cache
//           </button>
//         </div>
//       </section>

//       {/* Example 7: ping */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">7. Ping</h2>
//         <div className="space-x-2">
//           <button
//             onClick={() => {
//               pingMutation.mutate();
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Ping Server
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };
