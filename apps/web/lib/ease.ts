/*
 * Motion easing/spring tokens used by components/motion/*.
 *
 * Adapted from beUI (https://beui.dev) — MIT License,
 * Copyright (c) 2026 Saurabh Chauhan. See components/motion/LICENSE.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const
