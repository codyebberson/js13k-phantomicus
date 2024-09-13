/**
 * Player acceleration (meters per second per second).
 */
export const ACCELERATION = 100.0;

/**
 * Gravitational force (meters per second per second).
 */
export const GRAVITY = 60.0;

/**
 * Lesser gravity when player is still holding the jump button.
 */
export const FLOATY_GRAVITY = 20;

/**
 * Grace time in seconds where the player can still jump.
 * For example, if they walk of a ledge, they can still jump for a brief period of time.
 */
export const JUMP_GRACE_TIME = 0.25;

/**
 * Jump speed at time of jump (meters per second).
 */
export const JUMP_POWER = 12;

// 1.4, 2.4, 2.0
export const VACUUM_X_OFFSET = 1.4;
export const VACUUM_Y_OFFSET = 2.4;
export const VACUUM_Z_OFFSET = 2.0;

export const LIGHT_X_OFFSET = VACUUM_X_OFFSET;
export const LIGHT_Y_OFFSET = 3.2;
export const LIGHT_Z_OFFSET = VACUUM_Z_OFFSET;

export const BOSS_WAVES = 7;
