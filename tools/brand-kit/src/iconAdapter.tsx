// ─────────────────────────────────────────────────────────────────────────
// iconAdapter.tsx — renders the project's CHOSEN icon family in the kit.
//
// The viewer reads `icons.library` from DESIGN.md (lucide | phosphor | heroicons
// | tabler | hugeicons | custom). Each supported free family maps the canonical
// semantic slots to its own components + API. Unknown/Pro/custom families fall
// back gracefully (Lucide) with a flag so the UI can note it — never crashes,
// never silently shows the wrong family.
// ─────────────────────────────────────────────────────────────────────────
import type { ReactNode } from "react";
import { Home, Search, Calendar, Check, Bell, Settings, User, Plus } from "lucide-react";
import {
  House, MagnifyingGlass, Calendar as PhCalendar, Check as PhCheck, Bell as PhBell,
  Gear, User as PhUser, Plus as PhPlus,
} from "@phosphor-icons/react";
import {
  HomeIcon, MagnifyingGlassIcon, CalendarIcon, CheckIcon, BellIcon, Cog6ToothIcon, UserIcon, PlusIcon,
} from "@heroicons/react/24/outline";
import {
  IconHome, IconSearch, IconCalendar, IconCheck, IconBell, IconSettings, IconUser, IconPlus,
} from "@tabler/icons-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon, Search01Icon, Calendar03Icon, Tick02Icon, Notification03Icon, Settings01Icon, User03Icon, Add01Icon,
} from "@hugeicons/core-free-icons";

export type IconSlot = "home" | "search" | "calendar" | "check" | "bell" | "settings" | "user" | "plus";
export type IconSet = Record<IconSlot, ReactNode>;

const SZ = 22;

/** Resolve the family key from `icons.library` (preferred) or by sniffing `icons.family`. */
export function iconLibrary(icons: any): string {
  const lib = String(icons?.library ?? "").toLowerCase().trim();
  if (lib && lib !== "custom") return lib;
  if (lib === "custom") return "custom";
  const fam = String(icons?.family ?? "").toLowerCase();
  for (const k of ["lucide", "phosphor", "heroicons", "tabler", "hugeicons"]) if (fam.includes(k)) return k;
  return "lucide";
}

const lucideSet = (): IconSet => {
  const p = { size: SZ, strokeWidth: 1.8 };
  return { home: <Home {...p} />, search: <Search {...p} />, calendar: <Calendar {...p} />, check: <Check {...p} />,
    bell: <Bell {...p} />, settings: <Settings {...p} />, user: <User {...p} />, plus: <Plus {...p} /> };
};
const phosphorSet = (): IconSet => {
  const p = { size: SZ };
  return { home: <House {...p} />, search: <MagnifyingGlass {...p} />, calendar: <PhCalendar {...p} />, check: <PhCheck {...p} />,
    bell: <PhBell {...p} />, settings: <Gear {...p} />, user: <PhUser {...p} />, plus: <PhPlus {...p} /> };
};
const heroiconsSet = (): IconSet => {
  const s = { width: SZ, height: SZ };
  return { home: <HomeIcon style={s} />, search: <MagnifyingGlassIcon style={s} />, calendar: <CalendarIcon style={s} />,
    check: <CheckIcon style={s} />, bell: <BellIcon style={s} />, settings: <Cog6ToothIcon style={s} />,
    user: <UserIcon style={s} />, plus: <PlusIcon style={s} /> };
};
const tablerSet = (): IconSet => {
  const p = { size: SZ, stroke: 1.8 };
  return { home: <IconHome {...p} />, search: <IconSearch {...p} />, calendar: <IconCalendar {...p} />, check: <IconCheck {...p} />,
    bell: <IconBell {...p} />, settings: <IconSettings {...p} />, user: <IconUser {...p} />, plus: <IconPlus {...p} /> };
};
const hugeiconsSet = (): IconSet => {
  const hi = (icon: any) => <HugeiconsIcon icon={icon} size={SZ} strokeWidth={1.8} />;
  return { home: hi(Home01Icon), search: hi(Search01Icon), calendar: hi(Calendar03Icon), check: hi(Tick02Icon),
    bell: hi(Notification03Icon), settings: hi(Settings01Icon), user: hi(User03Icon), plus: hi(Add01Icon) };
};

const FAMILIES: Record<string, () => IconSet> = {
  lucide: lucideSet, phosphor: phosphorSet, heroicons: heroiconsSet, tabler: tablerSet, hugeicons: hugeiconsSet,
};

/** Returns the icon set for the project's family + whether it's a bundled (supported) one. */
export function getIconSet(icons: any): { set: IconSet; library: string; supported: boolean } {
  const library = iconLibrary(icons);
  const fn = FAMILIES[library];
  if (fn) return { set: fn(), library, supported: true };
  return { set: lucideSet(), library, supported: false }; // custom / Pro / unknown → Lucide placeholder
}
