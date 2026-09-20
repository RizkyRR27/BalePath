import { isBanjarProfile } from "@/domain/rules/is-banjar-profile";
import type { BanjarProfile } from "@/domain/entities/banjar-profile";

export function isValidBanjarProfile(value: unknown): value is BanjarProfile { return isBanjarProfile(value); }
export function isValidBanjarProfileList(value: unknown): value is BanjarProfile[] { return Array.isArray(value) && value.every(isValidBanjarProfile); }
