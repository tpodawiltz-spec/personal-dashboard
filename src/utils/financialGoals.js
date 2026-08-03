// Recursively rolls a goal's own contributions up together with all of its
// sub-goals, so a parent goal like "Pay for college" reflects progress made
// on its children (e.g. "Pay for first semester") automatically.
export function computeGoalProgress(goal, goals, contributions) {
  const children = goals.filter((g) => g.parent_id === goal.id)
  const ownContributions = contributions.filter((c) => c.goal_id === goal.id)

  const ownActual = ownContributions
    .filter((c) => c.is_actual)
    .reduce((sum, c) => sum + Number(c.amount), 0)
  const ownPlanned = ownContributions
    .filter((c) => !c.is_actual)
    .reduce((sum, c) => sum + Number(c.amount), 0)

  let childActual = 0
  let childPlanned = 0
  let childTargetSum = 0

  for (const child of children) {
    const result = computeGoalProgress(child, goals, contributions)
    childActual += result.actual
    childPlanned += result.planned
    childTargetSum += result.target ?? 0
  }

  const actual = ownActual + childActual
  const planned = ownPlanned + childPlanned
  const target =
    goal.target_amount != null
      ? Number(goal.target_amount)
      : children.length > 0
        ? childTargetSum
        : null

  return { actual, planned, target }
}
