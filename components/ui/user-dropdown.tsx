"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  Logout02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type UserDropdownUser = {
  name: string
  email: string
  avatar?: string | null
  initials: string
}

type UserDropdownAction = "dashboard" | "upgrade" | "logout"

type MenuItem = {
  icon: IconSvgElement
  label: string
  action: UserDropdownAction
  href?: string
  iconClassName?: string
  badge?: {
    text: string
    className: string
  }
  destructive?: boolean
}

interface UserDropdownProps {
  user: UserDropdownUser
  onAction?: (action: UserDropdownAction) => void | Promise<void>
  promoDiscount?: string
  signingOut?: boolean
  className?: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: DashboardSquare01Icon,
    label: "Dashboard",
    action: "dashboard",
    href: "/dashboard",
  },
  {
    icon: StarIcon,
    label: "Upgrade to Pro",
    action: "upgrade",
    iconClassName: "text-amber-600",
    badge: {
      text: "20% off",
      className:
        "border-transparent bg-amber-600 px-1.5 text-[11px] leading-4 text-white hover:bg-amber-600",
    },
  },
  {
    icon: Logout02Icon,
    label: "Log out",
    action: "logout",
    destructive: true,
  },
]

function MenuIcon({
  icon,
  className,
}: {
  icon: IconSvgElement
  className?: string
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={18}
      strokeWidth={1.8}
      className={cn("shrink-0 text-slate-500", className)}
    />
  )
}

export function UserDropdown({
  user,
  onAction,
  promoDiscount = "20% off",
  signingOut = false,
  className,
}: UserDropdownProps) {
  const handleAction = React.useCallback(
    (action: UserDropdownAction) => {
      void onAction?.(action)
    },
    [onAction]
  )

  const renderMenuItem = (item: MenuItem) => {
    const content = (
      <>
        <span className="flex min-w-0 items-center gap-2 font-medium">
          <MenuIcon icon={item.icon} className={item.iconClassName} />
          <span className="truncate">
            {item.action === "logout" && signingOut ? "Signing out..." : item.label}
          </span>
        </span>
        {item.badge && (
          <Badge className={item.badge.className}>
            {promoDiscount || item.badge.text}
          </Badge>
        )}
      </>
    )

    if (item.href) {
      return (
        <DropdownMenuItem
          key={item.action}
          asChild
          className="cursor-pointer justify-between rounded-lg p-2.5"
        >
          <Link href={item.href} onClick={() => handleAction(item.action)}>
            {content}
          </Link>
        </DropdownMenuItem>
      )
    }

    return (
      <DropdownMenuItem
        key={item.action}
        className="cursor-pointer justify-between rounded-lg p-2.5"
        disabled={signingOut && item.action === "logout"}
        variant={item.destructive ? "destructive" : "default"}
        onSelect={(event) => {
          if (item.action === "logout") {
            event.preventDefault()
          }
          handleAction(item.action)
        }}
      >
        {content}
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={cn(
            "nav-avatar overflow-hidden p-0 text-[0.8125rem]",
            className
          )}
        >
          <Avatar className="size-full rounded-full">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="bg-transparent font-semibold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="nav-menu w-[310px] rounded-2xl border bg-white p-0 text-slate-900"
      >
        <section className="rounded-2xl p-1">
          <div className="flex items-center gap-3 p-2.5">
            <Avatar className="size-11 border border-white shadow-sm">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="text-sm font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-950">
                {user.name}
              </h3>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>{MENU_ITEMS.map(renderMenuItem)}</DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export type { UserDropdownAction, UserDropdownUser }

export default UserDropdown
