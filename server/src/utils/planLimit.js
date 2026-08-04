/**
 * planLimit.js
 *
 * Defines the maximum number of interviews allowed per billing plan.
 * Used in interview.service.js to enforce limits before creating a session.
 *
 * To change limits, update the values here — nowhere else in the codebase
 * needs to change because every limit check imports this constant.
 */

// Interview limits for each plan
export const PLAN_LIMITS = {
  FREE: 20,
  GOLD: 50,
  PLATINUM: 100,
};
