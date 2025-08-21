import { IDL, Principal } from 'azle';

// Sports enum that matches the User Canister
export const Sports = IDL.Variant({
    Basketball: IDL.Null,
    Tennis: IDL.Null,
    Volleyball: IDL.Null,
    Football: IDL.Null,
    Padel: IDL.Null,
    Fitness: IDL.Null,
    Cycling: IDL.Null,
    Handball: IDL.Null,
    Camping: IDL.Null,
    Running: IDL.Null,
    Skateboarding: IDL.Null,
    Swimming: IDL.Null
});

export type Sports = {
    Basketball: null;
    Tennis: null;
    Volleyball: null;
    Football: null;
    Padel: null;
    Fitness: null;
    Cycling: null;
    Handball: null;
    Camping: null;
    Running: null;
    Skateboarding: null;
    Swimming: null;
};

// Tal3a Status enum
export const Tal3aStatus = IDL.Variant({
    Active: IDL.Null,
    Cancelled: IDL.Null,
    Completed: IDL.Null,
    Full: IDL.Null
});

export type Tal3aStatus = {
    Active: null;
    Cancelled: null;
    Completed: null;
    Full: null;
};

// Participant Status enum
export const ParticipantStatus = IDL.Variant({
    Going: IDL.Null,
    CantGo: IDL.Null,
    Maybe: IDL.Null
});

export type ParticipantStatus = {
    Going: null;
    CantGo: null;
    Maybe: null;
};

// City Data (matching User Canister)
export const CityData = IDL.Record({
    id: IDL.Nat16,
    name: IDL.Text,
    slug: IDL.Text,
    name_l1: IDL.Text
});

export type CityData = {
    id: number;
    name: string;
    slug: string;
    name_l1: string;
};

// Governorate Data (matching User Canister)
export const GovernorateData = IDL.Record({
    id: IDL.Nat8,
    name: IDL.Text,
    slug: IDL.Text,
    name_l1: IDL.Text
});

export type GovernorateData = {
    id: number;
    name: string;
    slug: string;
    name_l1: string;
};

// User simplified for Tal3a usage
export const UserProfile = IDL.Record({
    principal_id: IDL.Principal,
    username: IDL.Text,
    avatar_url: IDL.Opt(IDL.Vec(IDL.Nat8)),
    governorate: GovernorateData,
    city: CityData,
    sports: IDL.Vec(Sports)
});

export type UserProfile = {
    principal_id: Principal;
    username: string;
    avatar_url: number[] | undefined;
    governorate: GovernorateData;
    city: CityData;
    sports: Sports[];
};

// Tal3a main struct
export const Tal3a = IDL.Record({
    id: IDL.Nat64,
    group_id: IDL.Nat64,
    creator_id: IDL.Principal,
    title: IDL.Text,
    description: IDL.Text,
    tal3a_date: IDL.Nat64,
    place: IDL.Text,
    max_participants: IDL.Nat16,
    current_participants: IDL.Nat16,
    cost_per_person: IDL.Opt(IDL.Float64),
    sport: Sports,
    status: Tal3aStatus,
    image: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at: IDL.Nat64,
    updated_at: IDL.Nat64
});

export type Tal3a = {
    id: bigint;
    group_id: bigint;
    creator_id: Principal;
    title: string;
    description: string;
    tal3a_date: bigint;
    place: string;
    max_participants: number;
    current_participants: number;
    cost_per_person: number | undefined;
    sport: Sports;
    status: Tal3aStatus;
    image: number[] | undefined;
    created_at: bigint;
    updated_at: bigint;
};

// Tal3a Creation Input
export const Tal3aInput = IDL.Record({
    group_id: IDL.Nat64,
    title: IDL.Text,
    description: IDL.Text,
    tal3a_date: IDL.Nat64,
    place: IDL.Text,
    max_participants: IDL.Nat16,
    cost_per_person: IDL.Opt(IDL.Float64),
    sport: Sports,
    image: IDL.Opt(IDL.Vec(IDL.Nat8))
});

export type Tal3aInput = {
    group_id: bigint;
    title: string;
    description: string;
    tal3a_date: bigint;
    place: string;
    max_participants: number;
    cost_per_person: number | undefined;
    sport: Sports;
    image: number[] | undefined;
};

// Tal3a Update Input
export const Tal3aUpdate = IDL.Record({
    title: IDL.Opt(IDL.Text),
    description: IDL.Opt(IDL.Text),
    tal3a_date: IDL.Opt(IDL.Nat64),
    place: IDL.Opt(IDL.Text),
    max_participants: IDL.Opt(IDL.Nat16),
    cost_per_person: IDL.Opt(IDL.Float64),
    image: IDL.Opt(IDL.Vec(IDL.Nat8))
});

export type Tal3aUpdate = {
    title: string | undefined;
    description: string | undefined;
    tal3a_date: bigint | undefined;
    place: string | undefined;
    max_participants: number | undefined;
    cost_per_person: number | undefined;
    image: number[] | undefined;
};

// Tal3a Participant
export const Tal3aParticipant = IDL.Record({
    tal3a_id: IDL.Nat64,
    user_id: IDL.Principal,
    status: ParticipantStatus,
    joined_at: IDL.Nat64
});

export type Tal3aParticipant = {
    tal3a_id: bigint;
    user_id: Principal;
    status: ParticipantStatus;
    joined_at: bigint;
};

// Review struct
export const Review = IDL.Record({
    tal3a_id: IDL.Nat64,
    reviewer_id: IDL.Principal,
    rating: IDL.Nat8, // 1-5 stars
    comment: IDL.Opt(IDL.Text),
    created_at: IDL.Nat64
});

export type Review = {
    tal3a_id: bigint;
    reviewer_id: Principal;
    rating: number;
    comment: string | undefined;
    created_at: bigint;
};

// Comment struct
export const Comment = IDL.Record({
    id: IDL.Nat64,
    tal3a_id: IDL.Nat64,
    user_id: IDL.Principal,
    content: IDL.Text,
    parent_comment_id: IDL.Opt(IDL.Nat64),
    created_at: IDL.Nat64
});

export type Comment = {
    id: bigint;
    tal3a_id: bigint;
    user_id: Principal;
    content: string;
    parent_comment_id: bigint | undefined;
    created_at: bigint;
};

// Result types
export const Tal3aResult = IDL.Variant({
    Ok: Tal3a,
    Err: IDL.Text
});

export const Tal3aIdResult = IDL.Variant({
    Ok: IDL.Nat64,
    Err: IDL.Text
});

export const CommentResult = IDL.Variant({
    Ok: Comment,
    Err: IDL.Text
});

export const VoidResult = IDL.Variant({
    Ok: IDL.Null,
    Err: IDL.Text
});
