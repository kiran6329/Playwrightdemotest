export const searchCases = [
  { name: 'Exact match', term: 'Tiger Nixon', expectCountGreaterThan: 0 },
  { name: 'Partial match', term: 'Tokyo', expectCountGreaterThan: 0 },
  { name: 'Invalid search', term: 'zzzzzz', expectCountEquals: 0 },
];

export const sortColumns = [
  { column: 'Name', numeric: false },
  { column: 'Age', numeric: true },
  { column: 'Salary', numeric: true },
  { column: 'Start date', numeric: false }
];