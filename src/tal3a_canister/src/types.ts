import {
    bool,
    nat8,
    nat16,
    nat64,
    Opt,
    Principal,
    Record,
    text,
    Variant,
    Vec
} from 'azle/experimental';

// Sports enum - متوافق مع user_canister
export const Sports = Variant({
    Football: null as any,
    Basketball: null as any,
    Tennis: null as any,
    Cycling: null as any,
    Running: null as any,
    Swimming: null as any
});

// Tal3a status enum
export const Tal3aStatus = Variant({
    Planned: null as any,
    Active: null as any,
    Completed: null as any,
    Cancelled: null as any,
    Postponed: null as any
});

// Tal3a difficulty levels
export const DifficultyLevel = Variant({
    Beginner: null as any,
    Intermediate: null as any,
    Advanced: null as any,
    Professional: null as any
});

// Review rating enum
export const ReviewRating = Variant({
    OneStar: null as any,
    TwoStars: null as any,
    ThreeStars: null as any,
    FourStars: null as any,
    FiveStars: null as any
});

// Location data structure
export const Location = Record({
    latitude: text,
    longitude: text,
    address: text,
    city_id: nat16,
    governorate_id: nat8,
    venue_name: Opt(text),
    venue_type: Opt(text) // "stadium", "gym", "park", "court", etc.
});

// Media attachment structure
export const MediaAttachment = Record({
    id: nat64,
    file_type: text, // "image", "video", "document"
    file_url: text,
    file_name: text,
    file_size: nat64,
    thumbnail_url: Opt(text)
});

// Tal3a requirements structure
export const Tal3aRequirements = Record({
    min_age: Opt(nat8),
    max_age: Opt(nat8),
    skill_level: DifficultyLevel,
    equipment_needed: Vec(text),
    physical_requirements: Opt(text),
    additional_notes: Opt(text)
});

// Tal3a pricing structure
export const Tal3aPricing = Record({
    entry_fee: nat64, // في القروش
    currency: text, // "EGP"
    includes: Vec(text), // "equipment", "refreshments", "transport", etc.
    payment_methods: Vec(text), // "cash", "mobile_wallet", "card", etc.
    refund_policy: Opt(text)
});

// Participant structure
export const Tal3aParticipant = Record({
    user_id: Principal,
    joined_at: nat64,
    status: Variant({
        Confirmed: null as any,
        Pending: null as any,
        Waitlisted: null as any,
        Cancelled: null as any
    }),
    payment_status: Variant({
        Paid: null as any,
        Pending: null as any,
        Refunded: null as any,
        NotRequired: null as any
    }),
    notes: Opt(text)
});

// Review structure
export const Review = Record({
    id: nat64,
    tal3a_id: nat64,
    reviewer_id: Principal,
    rating: ReviewRating,
    comment: Opt(text),
    organization_rating: ReviewRating,
    venue_rating: ReviewRating,
    value_rating: ReviewRating,
    created_at: nat64,
    is_verified: bool, // إذا كان المراجع شارك فعلاً في الحدث
    helpful_count: nat64,
    reported_count: nat64
});

// Comment structure for Tal3a
export const Tal3aComment = Record({
    id: nat64,
    tal3a_id: nat64,
    author_id: Principal,
    content: text,
    parent_comment_id: Opt(nat64),
    replies: Vec(nat64),
    likes_count: nat64,
    dislikes_count: nat64,
    liked_by: Vec(Principal),
    disliked_by: Vec(Principal),
    created_at: nat64,
    updated_at: nat64,
    is_deleted: bool,
    edited: bool
});

// Main Tal3a structure
export const Tal3a = Record({
    id: nat64,
    title: text,
    description: text,
    sport: Sports,
    organizer_id: Principal,
    group_id: Opt(nat64), // إذا كان مرتبط بمجموعة معينة
    location: Location,
    start_time: nat64,
    end_time: nat64,
    max_participants: nat64,
    current_participants: nat64,
    participants: Vec(Tal3aParticipant),
    waitlist: Vec(Principal),
    status: Tal3aStatus,
    difficulty_level: DifficultyLevel,
    requirements: Tal3aRequirements,
    pricing: Tal3aPricing,
    media_attachments: Vec(MediaAttachment),
    tags: Vec(text),
    featured_image: Opt(text),
    is_recurring: bool,
    recurrence_pattern: Opt(text), // "weekly", "monthly", etc.
    weather_dependent: bool,
    contact_info: Opt(text),
    emergency_contact: Opt(text),
    rules_and_regulations: Opt(text),
    created_at: nat64,
    updated_at: nat64,
    cancelled_reason: Opt(text),
    views_count: nat64,
    shares_count: nat64,
    favorites_count: nat64,
    reviews_count: nat64,
    average_rating: text, // نحفظها كـ string للدقة (مثل "4.5")
    is_featured: bool,
    is_verified: bool, // إذا كان الحدث معتمد من الإدارة
    verification_badge: Opt(text),
    related_events: Vec(nat64), // أحداث مرتبطة
    sponsors: Vec(text),
    prizes: Vec(text),
    certificates: bool // إذا كان يقدم شهادات مشاركة
});

// Create Tal3a request structure
export const CreateTal3aRequest = Record({
    title: text,
    description: text,
    sport: Sports,
    group_id: Opt(nat64),
    location: Location,
    start_time: nat64,
    end_time: nat64,
    max_participants: nat64,
    difficulty_level: DifficultyLevel,
    requirements: Tal3aRequirements,
    pricing: Tal3aPricing,
    media_attachments: Vec(MediaAttachment),
    tags: Vec(text),
    featured_image: Opt(text),
    is_recurring: bool,
    recurrence_pattern: Opt(text),
    weather_dependent: bool,
    contact_info: Opt(text),
    emergency_contact: Opt(text),
    rules_and_regulations: Opt(text),
    sponsors: Vec(text),
    prizes: Vec(text),
    certificates: bool
});

// Update Tal3a request structure
export const Tal3aUpdate = Record({
    title: Opt(text),
    description: Opt(text),
    location: Opt(Location),
    start_time: Opt(nat64),
    end_time: Opt(nat64),
    max_participants: Opt(nat64),
    difficulty_level: Opt(DifficultyLevel),
    requirements: Opt(Tal3aRequirements),
    pricing: Opt(Tal3aPricing),
    media_attachments: Opt(Vec(MediaAttachment)),
    tags: Opt(Vec(text)),
    featured_image: Opt(text),
    weather_dependent: Opt(bool),
    contact_info: Opt(text),
    emergency_contact: Opt(text),
    rules_and_regulations: Opt(text),
    sponsors: Opt(Vec(text)),
    prizes: Opt(Vec(text)),
    certificates: Opt(bool)
});

// Tal3a filter structure
export const Tal3aFilter = Record({
    sport: Opt(Sports),
    city_id: Opt(nat16),
    governorate_id: Opt(nat8),
    status: Opt(Tal3aStatus),
    difficulty_level: Opt(DifficultyLevel),
    start_date: Opt(nat64),
    end_date: Opt(nat64),
    max_fee: Opt(nat64),
    organizer_id: Opt(Principal),
    group_id: Opt(nat64),
    has_prizes: Opt(bool),
    provides_certificates: Opt(bool),
    is_featured: Opt(bool),
    is_verified: Opt(bool)
});

// Join Tal3a request
export const JoinTal3aRequest = Record({
    tal3a_id: nat64,
    notes: Opt(text),
    emergency_contact: Opt(text)
});

// Tal3a statistics structure
export const Tal3aStats = Record({
    total_tal3as: nat64,
    active_tal3as: nat64,
    completed_tal3as: nat64,
    total_participants: nat64,
    total_reviews: nat64,
    average_rating: text,
    most_popular_sport: Sports,
    most_active_organizer: Principal
});

// User participation summary
export const UserParticipationSummary = Record({
    user_id: Principal,
    total_joined: nat64,
    total_organized: nat64,
    total_completed: nat64,
    total_cancelled: nat64,
    favorite_sport: Sports,
    total_reviews_given: nat64,
    average_rating_given: text,
    total_reviews_received: nat64,
    average_rating_received: text
});

export type ITal3a = typeof Tal3a;
export type ICreateTal3aRequest = typeof CreateTal3aRequest;
export type ITal3aUpdate = typeof Tal3aUpdate;
export type IReview = typeof Review;
export type ITal3aComment = typeof Tal3aComment;
export type ITal3aFilter = typeof Tal3aFilter;
export type IJoinTal3aRequest = typeof JoinTal3aRequest;
export type ITal3aParticipant = typeof Tal3aParticipant;
