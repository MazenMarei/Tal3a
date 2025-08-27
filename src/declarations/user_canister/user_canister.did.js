export const idlFactory = ({ IDL }) => {
  const Sports = IDL.Variant({
    'Basketball' : IDL.Null,
    'Tennis' : IDL.Null,
    'Volleyball' : IDL.Null,
    'Football' : IDL.Null,
    'Padel' : IDL.Null,
    'Fitness' : IDL.Null,
    'Cycling' : IDL.Null,
    'Handball' : IDL.Null,
    'Camping' : IDL.Null,
    'Running' : IDL.Null,
    'Skateboarding' : IDL.Null,
    'Swimming' : IDL.Null,
  });
  const UserActivity = IDL.Record({
    'duration' : IDL.Nat64,
    'time' : IDL.Nat64,
    'distance' : IDL.Opt(IDL.Float64),
    'user_id' : IDL.Principal,
    'sport' : Sports,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const NotificationType = IDL.Variant({
    'Reminder' : IDL.Null,
    'Message' : IDL.Null,
    'Alert' : IDL.Null,
  });
  const NewNotification = IDL.Record({
    'content' : IDL.Text,
    'notification_type' : NotificationType,
  });
  const RegisteringUser = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Text,
    'city' : IDL.Nat16,
    'free_days' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'avatar_url' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'governorate' : IDL.Nat8,
    'sports' : IDL.Vec(Sports),
  });
  const Notification = IDL.Record({
    'id' : IDL.Text,
    'is_read' : IDL.Bool,
    'content' : IDL.Text,
    'created_at' : IDL.Nat64,
    'notification_type' : NotificationType,
  });
  const CityData = IDL.Record({
    'id' : IDL.Nat16,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'name_l1' : IDL.Text,
  });
  const UserRole = IDL.Variant({ 'User' : IDL.Null, 'Admin' : IDL.Null });
  const GovernorateData = IDL.Record({
    'id' : IDL.Nat8,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'name_l1' : IDL.Text,
  });
  const User = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Text,
    'notifications' : IDL.Vec(Notification),
    'city' : CityData,
    'free_days' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'avatar_url' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'role' : UserRole,
    'manual_status' : IDL.Bool,
    'created_at' : IDL.Nat64,
    'last_active' : IDL.Nat64,
    'is_online' : IDL.Bool,
    'governorate' : GovernorateData,
    'principal_id' : IDL.Principal,
    'sports' : IDL.Vec(Sports),
    'activity' : IDL.Vec(UserActivity),
  });
  const Result_1 = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'Ok' : CityData, 'Err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'Ok' : GovernorateData, 'Err' : IDL.Text });
  const PublicUser = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Text,
    'city' : CityData,
    'avatar_url' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'role' : UserRole,
    'created_at' : IDL.Nat64,
    'last_active' : IDL.Nat64,
    'is_online' : IDL.Bool,
    'governorate' : GovernorateData,
    'principal_id' : IDL.Principal,
    'sports' : IDL.Vec(Sports),
  });
  const Result_4 = IDL.Variant({ 'Ok' : PublicUser, 'Err' : IDL.Text });
  const UpdatingUser = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Opt(IDL.Text),
    'city' : IDL.Opt(IDL.Nat16),
    'free_days' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'avatar_url' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'governorate' : IDL.Opt(IDL.Nat8),
    'sports' : IDL.Vec(Sports),
    'points' : IDL.Opt(IDL.Nat64),
  });
  return IDL.Service({
    'add_activity' : IDL.Func([UserActivity], [Result], []),
    'add_notification' : IDL.Func([NewNotification], [Result], []),
    'create_user' : IDL.Func([RegisteringUser], [Result_1], []),
    'delete_account' : IDL.Func([], [Result], []),
    'get_all_cities_in_governorate' : IDL.Func(
        [IDL.Nat8],
        [IDL.Vec(CityData)],
        ['query'],
      ),
    'get_all_governorates' : IDL.Func(
        [],
        [IDL.Vec(GovernorateData)],
        ['query'],
      ),
    'get_city' : IDL.Func([IDL.Nat16, IDL.Nat8], [Result_2], ['query']),
    'get_current_user' : IDL.Func([], [Result_1], ['query']),
    'get_governorate' : IDL.Func([IDL.Nat8], [Result_3], ['query']),
    'get_user' : IDL.Func([IDL.Principal], [Result_4], ['query']),
    'mark_notification_as_read' : IDL.Func([IDL.Text], [Result], []),
    'ping' : IDL.Func([], [Result], []),
    'set_account_status' : IDL.Func([IDL.Bool], [Result], []),
    'update_profile' : IDL.Func([UpdatingUser], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
