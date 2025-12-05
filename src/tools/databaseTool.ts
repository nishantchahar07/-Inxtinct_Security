import { Employee } from '../types/models';
import { EmployeeModel } from '../types/mongooseModels';
import { startOfMonth, endOfMonth, subMonths } from '../utils/dates';
import { toSingleSentence } from '../utils/format';

export async function runDatabaseTool(nlQuery: string): Promise<string> {
  const q = nlQuery.toLowerCase();

  if (/joined\s+last\s+month/.test(q)) {
    const lastMonth = subMonths(new Date(), 1);
    const from = startOfMonth(lastMonth);
    const to = endOfMonth(lastMonth);
    const count = await EmployeeModel.countDocuments({ joinedAt: { $gte: from, $lte: to } });
    return toSingleSentence(`There ${count === 1 ? 'is' : 'are'} ${count} employee${count === 1 ? '' : 's'} who joined last month.`);
  }

  if (/joined\s+(this|current)\s+month/.test(q)) {
    const now = new Date();
    const from = startOfMonth(now);
    const to = endOfMonth(now);
    const count = await EmployeeModel.countDocuments({ joinedAt: { $gte: from, $lte: to } });
    return toSingleSentence(`There ${count === 1 ? 'is' : 'are'} ${count} employee${count === 1 ? '' : 's'} who joined this month.`);
  }

  const cityMatch = q.match(/employees?\s+(in|from)\s+([a-zA-Z\s]+)\??$/);
  if (cityMatch) {
    const city = capitalizeWords(cityMatch[2].trim());
    const count = await EmployeeModel.countDocuments({ city });
    return toSingleSentence(`There ${count === 1 ? 'is' : 'are'} ${count} employee${count === 1 ? '' : 's'} in ${city}.`);
  }

  const deptMatch = q.match(/employees?\s+(in|from)\s+the\s+([a-zA-Z\s]+)\s+department/);
  if (deptMatch) {
    const department = capitalizeWords(deptMatch[2].trim());
    const employees: Employee[] = await EmployeeModel.find({ department }).limit(50).lean<Employee[]>();
    if (employees.length === 0) {
      return toSingleSentence(`There are no employees in the ${department} department.`);
    }
    const names = employees.map((e: Employee) => e.name).join(', ');
    return toSingleSentence(`Employees in the ${department} department include ${names}.`);
  }

  const avgMatch = q.match(/average\s+salary\s+(in|for)\s+the\s+([a-zA-Z\s]+)\s+department/);
  if (avgMatch) {
    const department = capitalizeWords(avgMatch[2].trim());
    const agg = await EmployeeModel.aggregate([
      { $match: { department } },
      { $group: { _id: null, avg: { $avg: '$salary' } } },
    ]);
    const avg = agg?.[0]?.avg;
    if (typeof avg !== 'number') {
      return toSingleSentence(`I could not compute the average salary for the ${department} department.`);
    }
    return toSingleSentence(`The average salary in the ${department} department is $${Math.round(avg)}.`);
  }

  const overMatch = q.match(/over\s*\$?([0-9]+)\b/);
  if (overMatch && /orders?/.test(q)) {
    return toSingleSentence('Order queries are not supported in this demo dataset.');
  }

  return toSingleSentence('I could not understand the database request.');
}

function capitalizeWords(s: string): string {
  return s.replace(/\b\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}
