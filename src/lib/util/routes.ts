import type { route } from "$lib/util/types"

export const routes: route[] = [
    {
        name: "Dashboard",
        iconClass: "fa-solid fa-gauge",
        url: "/"
    },
    {
        name: "Messaging",
        iconClass: "fa-solid fa-message",
        url: "/messaging"
    },
    {
        name: "Invoicing",
        iconClass: "fa-solid fa-receipt",
        url: "/invoicing"
    },
    {
        name: "Absence",
        iconClass: "fa-solid fa-thermometer",
        url: "/absence"
    },
    {
        name: "Sessions",
        iconClass: "fa-solid fa-calendar-days",
        url: "/session"
    },
    {
        name: "Recurring sessions",
        iconClass: "fa-solid fa-recycle",
        url: "/recurring-session"
    },
    {
        name: "Surveys",
        iconClass: "fa-solid fa-square-poll-vertical",
        url: "/survey"
    },
    {
        name: "Registration",
        iconClass: "fa-solid fa-pen",
        url: "/register"
    },
    {
        name: "Time off",
        iconClass: "fa-solid fa-calendar-xmark",
        url: "/time-off"
    },
    {
        name: "Expenses",
        iconClass: "fa-solid fa-money-bill",
        url: "/expenses"
    }
]