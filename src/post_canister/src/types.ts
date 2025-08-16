import {
  bool,
  nat64,
  Opt,
  Principal,
  Record,
  text,
  Variant,
  Vec,
} from "azle/experimental";

// Sports enum (same as in user_canister)
export const Sports = Variant({
  Football: null as any,
  Basketball: null as any,
  Tennis: null as any,
  Cycling: null as any,
  Running: null as any,
  Swimming: null as any,
});

// Post types
export const PostType = Variant({
  Text: null as any,
  Image: null as any,
  Video: null as any,
  Poll: null as any,
  Event: null as any,
});

// Post visibility options
export const PostVisibility = Variant({
  Public: null as any,
  GroupOnly: null as any,
  Private: null as any,
});

// Reaction types
export const ReactionType = Variant({
  Like: null as any,
  Dislike: null as any,
  Love: null as any,
  Laugh: null as any,
  Angry: null as any,
  Sad: null as any,
});

// Media attachment
export const MediaAttachment = Record({
  id: nat64,
  file_type: text, // image/jpeg, video/mp4, etc.
  file_size: nat64,
  file_data: text, // base64 encoded
  thumbnail: Opt(text),
  alt_text: Opt(text),
});

// Poll option
export const PollOption = Record({
  id: nat64,
  text: text,
  votes: nat64,
  voters: Vec(Principal),
});

// Poll data
export const PollData = Record({
  question: text,
  options: Vec(PollOption),
  multiple_choice: bool,
  expires_at: Opt(nat64),
  total_votes: nat64,
});

// Post reaction
export const PostReaction = Record({
  user_id: Principal,
  reaction_type: ReactionType,
  created_at: nat64,
});

// Comment
export const Comment = Record({
  id: nat64,
  post_id: nat64,
  author_id: Principal,
  content: text,
  parent_comment_id: Opt(nat64), // for nested comments
  replies: Vec(nat64), // IDs of reply comments
  reactions: Vec(PostReaction),
  created_at: nat64,
  updated_at: nat64,
  is_deleted: bool,
  edited: bool,
});

// Post seen status
export const PostSeenStatus = Record({
  user_id: Principal,
  post_id: nat64,
  seen_at: nat64,
});

// Main Post structure
export const Post = Record({
  id: nat64,
  author_id: Principal,
  group_id: Opt(nat64), // Optional - can be personal post
  content: text,
  post_type: PostType,
  visibility: PostVisibility,
  media_attachments: Vec(MediaAttachment),
  poll_data: Opt(PollData),
  tags: Vec(text), // hashtags or mentions
  mentioned_users: Vec(Principal),
  reactions: Vec(PostReaction),
  comments: Vec(nat64), // Comment IDs
  shares_count: nat64,
  created_at: nat64,
  updated_at: nat64,
  is_deleted: bool,
  edited: bool,
  pinned: bool, // for pinned posts in groups
  sport_related: Opt(Sports), // if post is related to specific sport
});

// Request types for creating posts
export const CreatePostRequest = Record({
  group_id: Opt(nat64),
  content: text,
  post_type: PostType,
  visibility: PostVisibility,
  media_attachments: Vec(MediaAttachment),
  poll_data: Opt(PollData),
  tags: Vec(text),
  mentioned_users: Vec(Principal),
  sport_related: Opt(Sports),
});

// Request type for creating comments
export const CreateCommentRequest = Record({
  post_id: nat64,
  content: text,
  parent_comment_id: Opt(nat64),
});

// Filter for posts
export const PostFilter = Record({
  group_id: Opt(nat64),
  author_id: Opt(Principal),
  post_type: Opt(PostType),
  sport_related: Opt(Sports),
  start_date: Opt(nat64),
  end_date: Opt(nat64),
  tags: Vec(text),
  limit: Opt(nat64),
  offset: Opt(nat64),
});

// Statistics
export const PostStats = Record({
  total_posts: nat64,
  total_comments: nat64,
  total_reactions: nat64,
  posts_today: nat64,
  most_active_user: Opt(Principal),
  trending_tags: Vec(text),
});

export type PostType = typeof Post;
export type CommentType = typeof Comment;
export type CreatePostRequestType = typeof CreatePostRequest;
export type CreateCommentRequestType = typeof CreateCommentRequest;
export type PostFilterType = typeof PostFilter;
export type PostStatsType = typeof PostStats;
