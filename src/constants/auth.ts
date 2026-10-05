export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'dev-fallback-do-not-use-in-prod-123-SECRET',
  halfOfHour: '30m',
  oneWeek: '7d',
};
