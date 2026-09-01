export const sortOptions = <T>(
  options: T[] = [],
  getLabel: (option: T) => unknown,
): T[] => {
  return [...options].sort((first, second) =>
    String(getLabel(first) ?? "").localeCompare(
      String(getLabel(second) ?? ""),
      "es",
      { sensitivity: "base", numeric: true },
    ),
  );
};
