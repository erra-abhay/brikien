export const generateCsv = (data: any[], fields: string[]) => {
  const replacer = (key: string, value: any) => value === null ? '' : value;
  const csv = data.map(row => 
    fields.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  csv.unshift(fields.join(',')); // add header column
  return csv.join('\r\n');
};
