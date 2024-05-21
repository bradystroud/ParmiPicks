export const sortOptions = {
    Recent: "Recent",
    Top: "Top",
    Low: "Low",
    // "": "",
} as const;

export type SortType = keyof typeof sortOptions;
