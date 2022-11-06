export function stringToColour(str: string): string {
    const colours = ["bg-indigo-500", "bg-red-600", "bg-orange-500", "bg-emerald-600", "bg-cyan-600", "bg-blue-600", "bg-sky-500", "bg-violet-500", "bg-rose-500", "bg-lime-500", "bg-gray-800"]
    if (str.length < 12) {
        return colours[str.length - 1]
    }
    return colours[Math.floor(str.length / 2)]
}