export const colorSchemes = [
    {
        background: "#94500b",
        foreground: "#e3801b",
    },
    {
        background: "#137160",
        foreground: "#1eac93",
    },
    {
        background: "#251254",
        foreground: "#754adf",
    },
    {
        background: "#610a49",
        foreground: "#ce199c",
    },
    {
        background: "#10782d",
        foreground: "#22bc4e",
    },
    {
        background: "#4d6611",
        foreground: "#a2d12f",
    },
]

export function chatIcon(id) {
    id = id % colorSchemes.length
    let bg = colorSchemes[id].background
    return {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
    }
}
export function chatIconText(id) {
    id = id % colorSchemes.length
    return {
        color: colorSchemes[id].foreground,
        fontWeight: "bold",
        fontSize: 26,
    }
}
