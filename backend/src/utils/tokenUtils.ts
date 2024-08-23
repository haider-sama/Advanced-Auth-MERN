
export const generateVerificationToken = (): string => {
    // return 'test-token-1234567890';
    return Math.random().toString().slice(-6); // Generates a 6-digit code
    
};