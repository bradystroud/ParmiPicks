export const sortOptions = {
    Top: "Top",
    Low: "Low",
    Recent: "Recent",
    // "": "",
} as const;

export type SortType = keyof typeof sortOptions;
