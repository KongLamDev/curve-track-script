// Mock ExcelJS Workbook
export const mockWorkbook = {
  worksheets: [
    {
      getRow: () => ({
        values: [
          "", // Empty index for the first row
          "ID",
          "Title",
          "Version",
          "Artist",
          "ISRC",
          "P Line",
          "Aliases",
          "Contract",
        ],
      }),
      eachRow: (
        _: unknown,
        callback: (
          obj: {
            getCell: (index: number) => { value: string };
          },
          index: number
        ) => void
      ) => {
        const rows = [
          // Row 1: Missing required field Title
          [
            "",
            "",
            "Version 1",
            "Artist 1",
            "ISRC1",
            "P Line 1",
            "",
            "Contract 1",
          ],
          // Row 2: Missing required field ISRC
          [
            "Leave blank if a new Track",
            "Track 2",
            "",
            "",
            "",
            "Any dashes, spaces or other characters will be stripped out on import",
            "",
            "Separate multiple alises using a semi-colon (;)",
          ],
          // Row 3: Existing contract name along with required fields title and isrc
          [
            "",
            "Track 3",
            "Version 3",
            "Artist 3",
            "ISRC3",
            "P Line 3",
            "aliases1;aliases2",
            "Contract 1",
          ],
          // Row 4: Contract name doesn't exist in contract collection
          [
            "",
            "Track 4",
            "Version 4",
            "Artist 4",
            "ISRC4",
            "P Line 4",
            "aliases11 ; aliases22",
            "Contract 2",
          ],
          // Row 5: No contract name, multiple semi-colons with no value
          [
            "",
            "Track 5",
            "Version 5",
            "Artist 5",
            "ISRC5",
            "P Line 5",
            "aliases111; ;; aliases222;",
            "",
          ],
        ];

        rows.forEach((rowValues, index) => {
          const rowObj = {
            getCell: (index: number) => ({ value: rowValues[index - 1] }),
          };
          callback(rowObj, index + 2); // First row starts at 2, since header keys start at 1
        });
      },
    },
  ],
  xlsx: { readFile: async () => mockWorkbook },
};
