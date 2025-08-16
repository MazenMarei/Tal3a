import { ic } from 'azle/experimental';

// Validation functions
export function validateTal3aTitle(title: string): string | null {
    if (!title || title.trim().length === 0) {
        return 'Tal3a title cannot be empty';
    }
    if (title.length > 200) {
        return 'Tal3a title cannot exceed 200 characters';
    }
    return null;
}

export function validateTal3aDescription(description: string): string | null {
    if (!description || description.trim().length === 0) {
        return 'Tal3a description cannot be empty';
    }
    if (description.length > 2000) {
        return 'Tal3a description cannot exceed 2000 characters';
    }
    return null;
}

export function validateTal3aTiming(startTime: bigint, endTime: bigint): string | null {
    const currentTime = BigInt(Date.now()) * 1000000n; // Convert to nanoseconds
    
    if (startTime <= currentTime) {
        return 'Tal3a start time must be in the future';
    }
    
    if (endTime <= startTime) {
        return 'Tal3a end time must be after start time';
    }
    
    // Check if the event duration is reasonable (not more than 30 days)
    const maxDuration = 30n * 24n * 60n * 60n * 1000000000n; // 30 days in nanoseconds
    if (endTime - startTime > maxDuration) {
        return 'Tal3a duration cannot exceed 30 days';
    }
    
    return null;
}

export function validateMaxParticipants(maxParticipants: bigint): string | null {
    if (maxParticipants <= 0n) {
        return 'Maximum participants must be greater than 0';
    }
    
    if (maxParticipants > 1000n) {
        return 'Maximum participants cannot exceed 1000';
    }
    
    return null;
}

export function validateEntryFee(entryFee: bigint): string | null {
    if (entryFee < 0n) {
        return 'Entry fee cannot be negative';
    }
    
    // Maximum entry fee: 10,000 EGP (1,000,000 قرش)
    if (entryFee > 1000000n) {
        return 'Entry fee cannot exceed 10,000 EGP';
    }
    
    return null;
}

export function validateLocation(latitude: string, longitude: string, address: string): string | null {
    // Validate latitude
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
        return 'Invalid latitude. Must be between -90 and 90';
    }
    
    // Validate longitude
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
        return 'Invalid longitude. Must be between -180 and 180';
    }
    
    // Validate address
    if (!address || address.trim().length === 0) {
        return 'Address cannot be empty';
    }
    
    if (address.length > 500) {
        return 'Address cannot exceed 500 characters';
    }
    
    return null;
}

export function validateReviewContent(comment: string): string | null {
    if (comment && comment.length > 1000) {
        return 'Review comment cannot exceed 1000 characters';
    }
    return null;
}

export function validateCommentContent(content: string): string | null {
    if (!content || content.trim().length === 0) {
        return 'Comment content cannot be empty';
    }
    
    if (content.length > 500) {
        return 'Comment cannot exceed 500 characters';
    }
    
    return null;
}

// Utility functions
export function getCurrentTime(): bigint {
    return BigInt(Date.now()) * 1000000n; // Convert to nanoseconds
}

export function isUserParticipant(participants: any[], userId: any): boolean {
    return participants.some(participant => 
        participant.user_id.toString() === userId.toString()
    );
}

export function getUserParticipant(participants: any[], userId: any): any | null {
    return participants.find(participant => 
        participant.user_id.toString() === userId.toString()
    ) || null;
}

export function isOrganizer(tal3a: any, userId: any): boolean {
    return tal3a.organizer_id.toString() === userId.toString();
}

export function canJoinTal3a(tal3a: any, userId: any): string | null {
    // Check if tal3a exists and is active
    if (!tal3a) {
        return 'Tal3a not found';
    }
    
    // Check if tal3a is in a joinable state
    if ('Completed' in tal3a.status || 'Cancelled' in tal3a.status) {
        return 'Cannot join completed or cancelled Tal3a';
    }
    
    // Check if user is the organizer
    if (isOrganizer(tal3a, userId)) {
        return 'Organizer cannot join their own Tal3a';
    }
    
    // Check if user is already a participant
    if (isUserParticipant(tal3a.participants, userId)) {
        return 'Already joined this Tal3a';
    }
    
    // Check if tal3a is full
    if (tal3a.current_participants >= tal3a.max_participants) {
        return 'Tal3a is full';
    }
    
    // Check if tal3a has already started
    const currentTime = getCurrentTime();
    if (tal3a.start_time <= currentTime) {
        return 'Cannot join Tal3a that has already started';
    }
    
    return null; // Can join
}

export function canLeaveTal3a(tal3a: any, userId: any): string | null {
    // Check if user is a participant
    if (!isUserParticipant(tal3a.participants, userId)) {
        return 'Not a participant in this Tal3a';
    }
    
    // Check if tal3a has already started or completed
    if ('Active' in tal3a.status || 'Completed' in tal3a.status) {
        return 'Cannot leave an active or completed Tal3a';
    }
    
    return null; // Can leave
}

export function canEditTal3a(tal3a: any, userId: any): string | null {
    // Check if user is the organizer
    if (!isOrganizer(tal3a, userId)) {
        return 'Only the organizer can edit this Tal3a';
    }
    
    // Check if tal3a has already completed
    if ('Completed' in tal3a.status) {
        return 'Cannot edit completed Tal3a';
    }
    
    return null; // Can edit
}

export function canDeleteTal3a(tal3a: any, userId: any): string | null {
    // Check if user is the organizer
    if (!isOrganizer(tal3a, userId)) {
        return 'Only the organizer can delete this Tal3a';
    }
    
    // Check if tal3a has already started
    const currentTime = getCurrentTime();
    if (tal3a.start_time <= currentTime) {
        return 'Cannot delete Tal3a that has already started';
    }
    
    return null; // Can delete
}

export function canReviewTal3a(tal3a: any, userId: any): string | null {
    // Check if tal3a is completed
    if (!('Completed' in tal3a.status)) {
        return 'Can only review completed Tal3a';
    }
    
    // Check if user participated in the tal3a
    if (!isUserParticipant(tal3a.participants, userId) && !isOrganizer(tal3a, userId)) {
        return 'Can only review Tal3a you participated in or organized';
    }
    
    return null; // Can review
}

// Helper function to format rating as string
export function formatRating(rating: number): string {
    return rating.toFixed(1);
}

// Helper function to calculate average rating
export function calculateAverageRating(ratings: number[]): string {
    if (ratings.length === 0) {
        return "0.0";
    }
    
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / ratings.length;
    return formatRating(average);
}

// Helper function to convert rating enum to number
export function ratingToNumber(rating: any): number {
    if ('OneStar' in rating) return 1;
    if ('TwoStars' in rating) return 2;
    if ('ThreeStars' in rating) return 3;
    if ('FourStars' in rating) return 4;
    if ('FiveStars' in rating) return 5;
    return 0;
}

// Helper function to convert sport enum to string
export function sportToString(sport: any): string {
    if ('Football' in sport) return 'Football';
    if ('Basketball' in sport) return 'Basketball';
    if ('Tennis' in sport) return 'Tennis';
    if ('Cycling' in sport) return 'Cycling';
    if ('Running' in sport) return 'Running';
    if ('Swimming' in sport) return 'Swimming';
    return 'Unknown';
}

// Helper function to check if two sports are equal
export function isSameSport(sport1: any, sport2: any): boolean {
    return sportToString(sport1) === sportToString(sport2);
}

// Helper function to check if two statuses are equal
export function isSameStatus(status1: any, status2: any): boolean {
    return JSON.stringify(status1) === JSON.stringify(status2);
}

// Helper function to sanitize text input
export function sanitizeText(text: string): string {
    return text.trim().replace(/[<>\"'&]/g, '');
}

// Helper function to generate unique reference code for tal3a
export function generateTal3aReference(tal3aId: bigint): string {
    const timestamp = Date.now().toString(36);
    const id = tal3aId.toString(36);
    return `TL3A-${timestamp}-${id}`.toUpperCase();
}
