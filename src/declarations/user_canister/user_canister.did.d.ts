import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CityData {
  'id' : number,
  'name' : string,
  'slug' : string,
  'name_l1' : string,
}
export interface GovernorateData {
  'id' : number,
  'name' : string,
  'slug' : string,
  'name_l1' : string,
}
export interface NewNotification {
  'content' : string,
  'notification_type' : NotificationType,
}
export interface Notification {
  'id' : string,
  'is_read' : boolean,
  'content' : string,
  'created_at' : bigint,
  'notification_type' : NotificationType,
}
export type NotificationType = { 'Reminder' : null } |
  { 'Message' : null } |
  { 'Alert' : null };
export interface PublicUser {
  'bio' : [] | [string],
  'username' : string,
  'city' : CityData,
  'avatar_url' : [] | [Uint8Array | number[]],
  'role' : UserRole,
  'created_at' : bigint,
  'last_active' : bigint,
  'is_online' : boolean,
  'governorate' : GovernorateData,
  'principal_id' : Principal,
  'sports' : Array<Sports>,
}
export interface RegisteringUser {
  'bio' : [] | [string],
  'username' : string,
  'city' : number,
  'free_days' : [] | [Uint8Array | number[]],
  'avatar_url' : [] | [Uint8Array | number[]],
  'governorate' : number,
  'sports' : Array<Sports>,
}
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : User } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : CityData } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : GovernorateData } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : PublicUser } |
  { 'Err' : string };
export type Sports = { 'Basketball' : null } |
  { 'Tennis' : null } |
  { 'Volleyball' : null } |
  { 'Football' : null } |
  { 'Padel' : null } |
  { 'Fitness' : null } |
  { 'Cycling' : null } |
  { 'Handball' : null } |
  { 'Camping' : null } |
  { 'Running' : null } |
  { 'Skateboarding' : null } |
  { 'Swimming' : null };
export interface UpdatingUser {
  'bio' : [] | [string],
  'username' : [] | [string],
  'city' : [] | [number],
  'free_days' : [] | [Uint8Array | number[]],
  'avatar_url' : [] | [Uint8Array | number[]],
  'governorate' : [] | [number],
  'sports' : Array<Sports>,
  'points' : [] | [bigint],
}
export interface User {
  'bio' : [] | [string],
  'username' : string,
  'notifications' : Array<Notification>,
  'city' : CityData,
  'free_days' : [] | [Uint8Array | number[]],
  'avatar_url' : [] | [Uint8Array | number[]],
  'role' : UserRole,
  'manual_status' : boolean,
  'created_at' : bigint,
  'last_active' : bigint,
  'is_online' : boolean,
  'governorate' : GovernorateData,
  'principal_id' : Principal,
  'sports' : Array<Sports>,
  'activity' : Array<UserActivity>,
}
export interface UserActivity {
  'duration' : bigint,
  'time' : bigint,
  'distance' : [] | [number],
  'user_id' : Principal,
  'sport' : Sports,
}
export type UserRole = { 'User' : null } |
  { 'Admin' : null };
export interface _SERVICE {
  'add_activity' : ActorMethod<[UserActivity], Result>,
  'add_notification' : ActorMethod<[NewNotification], Result>,
  'create_user' : ActorMethod<[RegisteringUser], Result_1>,
  'delete_account' : ActorMethod<[], Result>,
  'get_all_cities_in_governorate' : ActorMethod<[number], Array<CityData>>,
  'get_all_governorates' : ActorMethod<[], Array<GovernorateData>>,
  'get_city' : ActorMethod<[number, number], Result_2>,
  'get_current_user' : ActorMethod<[], Result_1>,
  'get_governorate' : ActorMethod<[number], Result_3>,
  'get_user' : ActorMethod<[Principal], Result_4>,
  'mark_notification_as_read' : ActorMethod<[string], Result>,
  'ping' : ActorMethod<[], Result>,
  'set_account_status' : ActorMethod<[boolean], Result>,
  'update_profile' : ActorMethod<[UpdatingUser], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
