// import React from "react";
// import {
//   useGovernorates,
//   useCitiesInGovernorate,
//   useCurrentUser,
//   useCreateUser,
//   useUpdateProfile,
// } from "@/hooks/useUserQueries";
// import { useAuthContext } from "@/contexts/AuthContext";
// import type {
//   RegisteringUser,
//   UpdatingUser,
// } from "declarations/user_canister/user_canister.did";

// export const UserDashboard: React.FC = () => {
//   const { user: authUser, login, isAuthenticated } = useAuthContext();

//   // Queries
//   const {
//     data: governorates,
//     isLoading: governoratesLoading,
//     error: governoratesError,
//   } = useGovernorates();

//   const {
//     data: currentUser,
//     isLoading: userLoading,
//     error: userError,
//   } = useCurrentUser();

//   const { data: cities, isLoading: citiesLoading } = useCitiesInGovernorate(
//     currentUser?.governorate?.id || 0
//   );

//   // Mutations
//   const createUserMutation = useCreateUser();
//   const updateProfileMutation = useUpdateProfile();

//   // Handlers
//   const handleCreateUser = async () => {
//     const newUser: RegisteringUser = {
//       username: "john_doe",
//       bio: ["Software Developer"],
//       governorate: 1, // Baghdad
//       city: 1, // Baghdad City
//       sports: [{ Football: null }],
//       avatar_url: [],
//       free_days: [],
//     };

//     try {
//       await createUserMutation.mutateAsync(newUser);
//       console.log("User created successfully!");
//     } catch (error) {
//       console.error("Failed to create user:", error);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     const updates: UpdatingUser = {
//       bio: ["Updated bio"],
//       username: ["new_username"],
//       sports: [{ Tennis: null }, { Basketball: null }],
//       city: [],
//       governorate: [],
//       avatar_url: [],
//       free_days: [],
//       points: [],
//     };

//     try {
//       await updateProfileMutation.mutateAsync(updates);
//       console.log("Profile updated successfully!");
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//     }
//   };

//   // Loading states
//   if (!authUser) {
//     return (
//       <div className="p-4">
//         <h1>Please login first</h1>
//         <button
//           onClick={() => login("ii")}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Login with Internet Identity
//         </button>
//       </div>
//     );
//   }

//   if (userLoading) {
//     return <div className="p-4">Loading user data...</div>;
//   }

//   // Error states
//   if (userError) {
//     return <div className="p-4 text-red-500">Error: {userError.message}</div>;
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

//       {/* User Profile Section */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Profile</h2>
//         {currentUser && (
//           <div className="space-y-2">
//             <p>
//               <strong>Username:</strong> {currentUser.username}
//             </p>
//             <p>
//               <strong>Bio:</strong> {currentUser.bio?.[0] || "No bio"}
//             </p>
//             <p>
//               <strong>Governorate:</strong> {currentUser.governorate.name}
//             </p>
//             <p>
//               <strong>City:</strong> {currentUser.city.name}
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
//         <button
//           onClick={handleUpdateProfile}
//           disabled={updateProfileMutation.isPending}
//           className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
//         </button>
//       </div>

//       {/* Governorates Section */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Governorates</h2>
//         {governoratesLoading && <p>Loading governorates...</p>}
//         {governoratesError && (
//           <p className="text-red-500">Error: {governoratesError.message}</p>
//         )}
//         {governorates && (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//             {governorates.map((gov) => (
//               <div key={gov.id} className="border p-2 rounded">
//                 <p className="font-medium">{gov.name}</p>
//                 <p className="text-sm text-gray-500">{gov.name_l1}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Cities Section */}
//       {currentUser && (
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Cities in {currentUser.governorate.name}
//           </h2>
//           {citiesLoading && <p>Loading cities...</p>}
//           {cities && (
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//               {cities.map((city) => (
//                 <div key={city.id} className="border p-2 rounded">
//                   <p className="font-medium">{city.name}</p>
//                   <p className="text-sm text-gray-500">{city.name_l1}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Create User Section (for testing) */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Actions</h2>
//         <div className="space-x-4">
//           <button
//             onClick={handleCreateUser}
//             disabled={createUserMutation.isPending}
//             className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {createUserMutation.isPending ? "Creating..." : "Create Test User"}
//           </button>
//         </div>

//         {/* Show mutation status */}
//         {createUserMutation.error && (
//           <p className="text-red-500 mt-2">
//             Create error: {createUserMutation.error.message}
//           </p>
//         )}
//         {updateProfileMutation.error && (
//           <p className="text-red-500 mt-2">
//             Update error: {updateProfileMutation.error.message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };
